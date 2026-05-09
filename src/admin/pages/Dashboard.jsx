import { useEffect, useState } from "react"
import API from "../../services/API"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts"
import { useAuth } from "../../context/AuthContext"

/* ===== FORMAT DATE ===== */
const formatDay = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short"
  })
}

/* ===== FORMAT ₹k ===== */
const formatCurrency = (value) => {
  if (value >= 1000) return `₹${value / 1000}k`
  return `₹${value}`
}

/* ===== DATE RANGE ===== */
const getDatesBetween = (start, end) => {
  const dates = []
  const current = new Date(start)

  while (current <= end) {
    dates.push(current.toISOString().split("T")[0])
    current.setDate(current.getDate() + 1)
  }
  return dates
}

/* ===== CUSTOM TOOLTIP ===== */
const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-white px-4 py-2 rounded shadow text-sm">
      <p className="font-semibold text-black">{formatDay(label)}</p>
      <p className="text-blue-600">
        Revenue: <strong>₹{payload[0].value}</strong>
      </p>
    </div>
  )
}

const Dashboard = () => {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [range, setRange] = useState("7")
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()




  useEffect(() => {
    Promise.all([
      API.get("/orders"),
      API.get("/products"),
      API.get("/users")
    ])
      .then(([o, p, u]) => {
        setOrders(o.data)
        setProducts(p.data)
        setUsers(u.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>
  }

  /* ===== STATS ===== */
  const totalRevenue = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((s, o) => s + Number(o.total || 0), 0)

  /* ===== CHART DATA ===== */
  const validOrders = orders.filter(
    o => o.createdAt && o.status !== "Cancelled"
  )

  const today = new Date()
  const startDate = new Date()
  startDate.setDate(today.getDate() - (range === "7" ? 6 : 29))

  const allDates = getDatesBetween(startDate, today)

  const dailyMap = {}
  allDates.forEach(d => {
    dailyMap[d] = { date: d, revenue: 0, orders: 0 }
  })

  validOrders.forEach(o => {
    const key = new Date(o.createdAt).toISOString().split("T")[0]
    if (!dailyMap[key]) return

    dailyMap[key].orders += 1
    dailyMap[key].revenue += Number(o.total || 0)
  })

  const chartData = Object.values(dailyMap)

  /* ===== TOP CUSTOMERS ===== */
  const customerMap = {}

  orders
    .filter(o => o.status !== "Cancelled")
    .forEach(o => {
      const user = users.find(u => u.id === o.userId)
      if (!user) return

      if (!customerMap[user.id]) {
        customerMap[user.id] = {
          name: user.name,
          email: user.email,
          orders: 0,
          spent: 0
        }
      }

      customerMap[user.id].orders += 1
      customerMap[user.id].spent += Number(o.total || 0)
    })

  const topCustomers = Object.values(customerMap)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5)

  /* ===== RECENT ORDERS ===== */
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <div className="space-y-12">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${totalRevenue}`} />
        <StatCard title="Total Orders" value={orders.length} />
        <StatCard title="Total Products" value={products.length} />
        <StatCard title="Total Users" value={users.length} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-8">
          <div className="flex justify-between mb-6">
            <h2 className="font-semibold text-black">
              Revenue Analytics
            </h2>
            <select
              value={range}
              onChange={e => setRange(e.target.value)}
              className="border text-black border-gray-300 px-3 py-1 rounded-md text-sm focus:outline-none focus:border-black"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 6" stroke="#e5e7eb" />
              <XAxis dataKey="date" tickFormatter={formatDay} />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip content={<RevenueTooltip />} />

              <Line
                type="monotoneX"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
                activeDot={false}
                fill="url(#revGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="font-semibold text-black mb-6">
            Orders Overview
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 6" />
              <XAxis dataKey="date" tickFormatter={formatDay} />
              <YAxis allowDecimals={false} />

              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
                labelStyle={{ color: "#000" }}
                itemStyle={{ color: "#8b5cf6" }}
              />

              <Bar dataKey="orders" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Customers */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="font-semibold text-black mb-6">
            Top Customers
          </h2>

          {topCustomers.map((c, i) => (
            <div key={i} className="flex justify-between border-b border-gray-100 py-4">
              <div>
                <p className="font-semibold text-black">{c.name}</p>
                <p className="text-sm text-gray-500">{c.email}</p>
              </div>
              <div className="text-right">
                <p className="text-black">{c.orders} Orders</p>
                <p className="font-semibold text-black">₹{c.spent}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="font-semibold text-black mb-6">
            Recent Orders
          </h2>

          {recentOrders.map(o => (
            <div key={o.id} className="flex justify-between border-b border-gray-100 py-4">
              <div>
                <p className="font-semibold text-black">
                  Order #{o.id}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(o.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-black">
                  ₹{o.total}
                </p>
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-black">
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Dashboard

/* ===== STAT CARD ===== */
const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-2xl p-6 shadow-md">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-2xl font-semibold text-black mt-2">
      {value}
    </p>
  </div>
)