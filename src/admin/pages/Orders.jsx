import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../../services/API"
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  TrashIcon
} from "@heroicons/react/24/outline"
import DeleteOrderModal from "../components/DeleteOrderModal"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("All")

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    API.get("/orders")
      .then(res => setOrders(res.data.reverse()))
      .finally(() => setLoading(false))
  }, [])

  /* ===== FILTER ===== */
  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.userId?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      status === "All" ? true : o.status === status

    return matchesSearch && matchesStatus
  })

  /* ===== DELETE ORDER ===== */
  const openDeleteModal = (order) => {
    setSelectedOrder(order)
    setShowDeleteModal(true)
  }

  const confirmDeleteOrder = async () => {
    if (!selectedOrder) return

    // API placeholder
    // await API.delete(`/orders/${selectedOrder.id}`)

    setOrders(prev =>
      prev.filter(o => o.id !== selectedOrder.id)
    )

    setShowDeleteModal(false)
    setSelectedOrder(null)
  }

  if (loading) {
    return <p className="text-center mt-10">Loading orders...</p>
  }

 return (
  <div className="space-y-8">

    {/* HEADER */}
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">

      <div>
        <h1 className="text-2xl font-semibold text-white">
          Order Management
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Manage and track customer orders
        </p>
      </div>

      {/* STATUS FILTER */}
      <div className="relative">
        <FunnelIcon className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="text-black pl-11 pr-6 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-black transition text-sm"
        >
          <option value="All">All Status</option>
          <option value="Order Placed">Order Placed</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

    </div>

    {/* CARD */}
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">

      {/* SEARCH */}
      <div className="p-6 border-b border-gray-200">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID or User ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none text-black focus:border-black transition text-sm"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map(order => (
              <tr
                key={order.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >

                {/* ORDER ID */}
                <td className="p-4 font-medium text-black">
                  #{order.id}
                </td>

                {/* DATE */}
                <td className="p-4 text-gray-600">
                  <div>
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleTimeString("en-IN")}
                  </div>
                </td>

                {/* CUSTOMER */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-black text-xs">
                      {order.userId?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-black">
                        User {order.userId}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.items?.length || 0} items
                      </p>
                    </div>
                  </div>
                </td>

                {/* STATUS */}
                <td className="p-4 text-center">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-black">
                    {order.status}
                  </span>
                </td>

                {/* TOTAL */}
                <td className="p-4 font-semibold text-black">
                  ₹{order.total}
                </td>

                {/* ACTIONS */}
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-3">

                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="p-2 border border-gray-200 rounded-md hover:bg-black hover:text-white transition"
                    >
                      <EyeIcon className="text-black hover:text-white w-5 h-5" />
                    </Link>

                    <button
                      onClick={() => openDeleteModal(order)}
                      className="p-2 border border-gray-200 rounded-md hover:bg-black hover:text-white transition"
                    >
                      <TrashIcon className="text-black hover:text-white w-5 h-5" />
                    </button>

                  </div>
                </td>

              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-10 text-center text-gray-400">
                  No orders found
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>

    {/* DELETE MODAL */}
    <DeleteOrderModal
      open={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      onConfirm={confirmDeleteOrder}
    />

  </div>
)
}

export default Orders
