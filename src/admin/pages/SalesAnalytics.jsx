import { useEffect, useState } from "react"
import API from "../../services/API"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts"

/* ================= CATEGORIES ================= */

const CATEGORIES = [
  "Protein",
  "Performance",
  "Vitamins & Health",
  "Nutrition",
  "Hydration"
]

/* ================= COLORS ================= */

const STATUS_COLORS = {
  Cancelled: "#10b981",
  Delivered: "#fbbf24",
  "Out for Delivery": "#3b82f6"
}

/* ================= HELPERS ================= */

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short"
  })

const formatCurrency = (value) =>
  value >= 1000 ? `₹${(value / 1000).toFixed(0)}k` : `₹${value}`

const getDatesBetween = (start, end) => {
  const dates = []
  const current = new Date(start)

  while (current <= end) {
    dates.push(current.toISOString().split("T")[0])
    current.setDate(current.getDate() + 1)
  }
  return dates
}

/* ================= COMPONENT ================= */

const SalesAnalytics = () => {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [range, setRange] = useState(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      API.get("/orders"),
      API.get("/products")
    ])
      .then(([o, p]) => {
        setOrders(o.data)
        setProducts(p.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-center mt-10">Loading analytics...</p>
  }

  /* ================= VALID ORDERS ================= */

  const validOrders = orders.filter(
    o => o.status !== "Cancelled" && o.createdAt
  )

  /* ================= DATE RANGE ================= */

  const today = new Date()
  const startDate = new Date()
  startDate.setDate(today.getDate() - (range - 1))

  const allDates = getDatesBetween(startDate, today)

  const dailyRevenueMap = {}
  allDates.forEach(d => {
    dailyRevenueMap[d] = { date: d, revenue: 0 }
  })

  validOrders.forEach(o => {
    const key = new Date(o.createdAt).toISOString().split("T")[0]
    if (dailyRevenueMap[key]) {
      dailyRevenueMap[key].revenue += Number(o.total || 0)
    }
  })

  const revenueData = Object.values(dailyRevenueMap)

  /* ================= KPI ================= */

  const totalRevenue = validOrders.reduce(
    (sum, o) => sum + Number(o.total || 0),
    0
  )

  const totalOrders = validOrders.length
  const avgOrderValue =
    totalOrders === 0 ? 0 : Math.round(totalRevenue / totalOrders)

  /* ================= ORDER STATUS DONUT ================= */

  const statusMap = {
    Cancelled: 0,
    Delivered: 0,
    "Out for Delivery": 0
  }

  orders.forEach(o => {
    if (statusMap[o.status] !== undefined) {
      statusMap[o.status] += 1
    }
  })

  const orderStatusData = Object.keys(statusMap).map(k => ({
    name: k,
    value: statusMap[k]
  }))

  /* ================= TOP SELLING PRODUCTS ================= */

  const productMap = {}

  orders.forEach(order => {
    order.items?.forEach(item => {
      if (!productMap[item.productId]) {
        productMap[item.productId] = {
          title: item.title,
          units: 0,
          revenue: 0
        }
      }

      productMap[item.productId].units += item.qty
      productMap[item.productId].revenue += item.qty * item.price
    })
  })

  const topProducts = Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  return (
    <div className="space-y-10">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales Analytics</h1>
          <p className="text-gray-500 mt-1">
            Detailed insights into your store performance.
          </p>
        </div>

        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setRange(d)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                range === d
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Last {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* ================= KPI ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Revenue" value={`₹${totalRevenue}`} />
        <StatCard title="Total Orders" value={totalOrders} />
        <StatCard title="Avg Order Value" value={`₹${avgOrderValue}`} />
      </div>

      {/* ================= REVENUE TREND ================= */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-bold text-lg mb-4">Revenue Trend</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 6" />
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip />
            <Line
              type="monotoneX"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= BOTTOM SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ORDER STATUS */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-bold text-lg mb-6">Order Status</h2>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={orderStatusData}
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={STATUS_COLORS[entry.name]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex justify-center gap-4 mt-4">
            {orderStatusData.map(s => (
              <span
                key={s.name}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: STATUS_COLORS[s.name] }}
                />
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {/* TOP SELLING PRODUCTS */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-bold text-lg mb-4">
            Top Selling Products
          </h2>

          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b">
              <tr>
                <th className="text-left py-2">Product Name</th>
                <th className="text-center py-2">Units Sold</th>
                <th className="text-right py-2">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {topProducts.map((p, i) => (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-3 font-medium">{p.title}</td>
                  <td className="text-center">{p.units}</td>
                  <td className="text-right font-semibold">
                    ₹{p.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SalesAnalytics

/* ================= STAT CARD ================= */

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-2xl shadow p-6">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
)
