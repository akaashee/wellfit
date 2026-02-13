import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import API from "../services/API"

const ORDER_STAGES = [
  "Order Placed",
  "Processing",
  "Out for Delivery",
  "Delivered",
]

const CANCEL_ALLOWED_STATUSES = [
  "Order Placed",
  "Processing",
]

const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    API.get(`/orders/${id}`).then(res => setOrder(res.data))
  }, [id])

  if (!order) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    )
  }

  const normalizedStatus = order.status?.trim()

  const currentStageIndex =
    ORDER_STAGES.indexOf(normalizedStatus)

  const canCancel =
    CANCEL_ALLOWED_STATUSES.includes(normalizedStatus)

  /* CANCEL ORDER */
  const confirmCancelOrder = async () => {
    try {
      setLoading(true)
      const res = await API.patch(`/orders/${id}`, {
        status: "Cancelled",
      })
      setOrder(res.data)
      setShowCancelModal(false)
    } catch (err) {
      console.error("Cancel failed", err)
    } finally {
      setLoading(false)
    }
  }

  const progressPercent =
    currentStageIndex >= 0
      ? (currentStageIndex /
          (ORDER_STAGES.length - 1)) *
        100
      : 0

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* ORDER SUMMARY */}
      <div className="border border-gray-600 p-4 rounded relative">
        <h1 className="text-2xl font-bold mb-2">
          Order #{order.id}
        </h1>

        <p className="mb-2">
          Status:{" "}
          <strong
            className={
              normalizedStatus === "Cancelled"
                ? "text-red-500"
                : "text-green-600"
            }
          >
            {normalizedStatus}
          </strong>
        </p>

        <p className="mb-4 text-sm text-gray-500">
          Ordered On:{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>

        {/* ✅ CANCEL BUTTON (NOW WORKS) */}
        {canCancel && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="absolute top-4 right-4 z-10 text-red-500 border border-red-500 px-4 py-1.5 rounded hover:bg-red-500 hover:text-white transition"
          >
            Cancel Order
          </button>
        )}

        {/* DELIVERY DETAILS */}
        {order.customer && (
          <div className="border rounded p-4 mb-8 bg-gray-50">
            <h3 className="font-bold mb-3">
              Delivery Details
            </h3>

            <p className="text-sm mb-1">
              <strong>Name:</strong>{" "}
              {order.customer.name}
            </p>

            <p className="text-sm mb-1">
              <strong>Phone:</strong>{" "}
              {order.customer.phone}
            </p>

            <p className="text-sm">
              <strong>Address:</strong>{" "}
              {order.customer.address}
            </p>
          </div>
        )}

        {/* ORDER PROGRESS */}
        {normalizedStatus !== "Cancelled" && (
          <div className="mb-10">
            <h3 className="font-bold mb-6">
              Order Progress
            </h3>

            <div className="relative">
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-300 rounded" />

              <div
                className="absolute top-4 left-0 h-1 bg-green-500 rounded transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />

              <div className="relative flex justify-between">
                {ORDER_STAGES.map((stage, index) => {
                  const isCompleted =
                    index <= currentStageIndex

                  return (
                    <div
                      key={stage}
                      className="flex flex-col items-center"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 ${
                          isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : "bg-white border-gray-300 text-gray-400"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <p
                        className={`mt-2 text-sm text-center ${
                          isCompleted
                            ? "font-semibold text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {stage}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ITEMS */}
        <h3 className="font-bold mt-4 mb-2">
          Items
        </h3>

        <div className="space-y-2 mb-6">
          {order.items.map((item, index) => (
            <div key={index} className="text-sm">
              {item.title} ({item.weight}) × {item.qty}
            </div>
          ))}
        </div>

        <p className="font-bold">
          Total: ₹{order.total}
        </p>
      </div>

      {/* SHOP NOW */}
      <div className="flex justify-center mt-16">
        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-6 py-3 rounded hover:opacity-90"
        >
          Shop Now
        </button>
      </div>

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center">
            <h2 className="text-lg font-bold mb-4">
              Cancel Order?
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to cancel this order?
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border rounded"
                disabled={loading}
              >
                No
              </button>

              <button
                onClick={confirmCancelOrder}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={loading}
              >
                {loading
                  ? "Cancelling..."
                  : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetails
