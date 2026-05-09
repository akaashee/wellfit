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
  <div className="min-h-screen bg-black py-24">
    <div className="max-w-4xl mx-auto px-6">

      <div className="bg-white rounded-2xl shadow-xl p-10 relative">

        {/* HEADER */}
        <h1 className="text-2xl font-semibold text-black mb-3">
          Order #{order.id}
        </h1>

        <p className="mb-2 text-black">
          Status:{" "}
          <strong>
            {normalizedStatus}
          </strong>
        </p>

        <p className="mb-6 text-sm text-gray-500">
          Ordered On:{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>

        {/* CANCEL BUTTON */}
        {canCancel && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="absolute top-8 right-10 border border-black text-black px-4 py-2 rounded-md hover:bg-black hover:text-white transition"
          >
            Cancel Order
          </button>
        )}

        {/* DELIVERY DETAILS */}
        {order.customer && (
          <div className="border border-gray-200 rounded-lg p-6 mb-10">
            <h3 className="font-semibold text-black mb-4">
              Delivery Details
            </h3>

            <p className="text-sm mb-1 text-black">
              <strong>Name:</strong> {order.customer.name}
            </p>

            <p className="text-sm mb-1 text-black">
              <strong>Phone:</strong> {order.customer.phone}
            </p>

            <p className="text-sm text-black">
              <strong>Address:</strong> {order.customer.address}
            </p>
          </div>
        )}

        {/* ORDER PROGRESS */}
        {normalizedStatus !== "Cancelled" && (
          <div className="mb-12">
            <h3 className="font-semibold text-black mb-6">
              Order Progress
            </h3>

            <div className="relative">
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded" />

              <div
                className="absolute top-4 left-0 h-1 bg-black rounded transition-all duration-500"
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
                            ? "bg-black border-black text-white"
                            : "bg-white border-gray-300 text-gray-400"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <p
                        className={`mt-2 text-sm text-center ${
                          isCompleted
                            ? "font-medium text-black"
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
        <h3 className="font-semibold text-black mb-4">
          Items
        </h3>

        <div className="space-y-3 mb-6">
          {order.items.map((item, index) => (
            <div key={index} className="text-sm text-black">
              {item.title} ({item.weight}) × {item.qty}
            </div>
          ))}
        </div>

        <p className="font-bold text-black">
          Total: ₹{order.total}
        </p>
      </div>

      {/* SHOP NOW */}
      <div className="flex justify-center mt-16">
        <button
          onClick={() => navigate("/products")}
          className="bg-white text-black px-8 py-3 rounded-md font-medium hover:opacity-85 transition"
        >
          Shop Now
        </button>
      </div>

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-80 text-center shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-black">
              Cancel Order?
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to cancel this order?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-md text-black hover:bg-black hover:text-white transition"
                disabled={loading}
              >
                No
              </button>

              <button
                onClick={confirmCancelOrder}
                className="px-5 py-2 bg-black text-white rounded-md hover:opacity-85 transition"
                disabled={loading}
              >
                {loading ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  </div>
)
}

export default OrderDetails
