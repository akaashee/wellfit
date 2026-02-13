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
      .then(res => setOrders(res.data))
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
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-gray-500 mt-1">
            Manage and track customer orders
          </p>
        </div>

        {/* STATUS FILTER */}
        <div className="relative">
          <FunnelIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg"
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
      <div className="bg-white rounded-2xl shadow">
        {/* SEARCH */}
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID or User ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-500">
              <tr>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Status</th>
                <th className="p-4">Total</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  {/* ORDER ID */}
                  <td className="p-4 font-medium">
                    #{order.id}
                  </td>

                  {/* DATE */}
                  <td className="p-4 text-sm text-gray-600">
                    <div>{new Date(order.createdAt).toLocaleDateString("en-IN")}</div>
                    <div className="text-xs">
                      {new Date(order.createdAt).toLocaleTimeString("en-IN")}
                    </div>
                  </td>

                  {/* CUSTOMER */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700">
                        {order.userId?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Shipped"
                        ? "bg-purple-100 text-purple-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>

                  {/* TOTAL */}
                  <td className="p-4 font-semibold">
                    ₹{order.total}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-4">
                      {/* VIEW */}
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-gray-500 hover:text-blue-600"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>

                      {/* DELETE */}
                      <button
                        onClick={() => openDeleteModal(order)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
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
