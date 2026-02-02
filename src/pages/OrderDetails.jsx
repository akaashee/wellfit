import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import API from "../services/API"

const ORDER_STAGES = [
  "Order Placed",
  "Packed",
  "Shipped",
  "Delivered"
]

const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)

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

  // Find current stage index
  const currentStageIndex = ORDER_STAGES.indexOf(order.status)

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">

      {/* ORDER SUMMARY */}
      <div className="border border-gray-600 p-4 rounded">

        <h1 className="text-2xl font-bold mb-2">
          Order #{order.id}
        </h1>

        <p className="mb-2">
          Status: <strong>{order.status}</strong>
        </p>

        <p className="mb-4 text-sm text-gray-500">
          Ordered On:{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>

        {/* ORDER STAGE TRACKER */}
        <div className="mb-6">
          <h3 className="font-bold mb-4">
            Order Progress
          </h3>

          <div className="flex justify-between items-center">
            {ORDER_STAGES.map((stage, index) => {
              const isCompleted = index <= currentStageIndex

              return (
                <div
                  key={stage}
                  className="flex-1 text-center"
                >
                  <div
                    className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center mb-2
                      ${isCompleted
                        ? "bg-black text-white"
                        : "bg-gray-300 text-gray-600"}
                    `}
                  >
                    {index + 1}
                  </div>

                  <p
                    className={`text-sm ${
                      isCompleted
                        ? "font-semibold text-black"
                        : "text-gray-400"
                    }`}
                  >
                    {stage}
                  </p>

                  {/* LINE */}
                  {index !== ORDER_STAGES.length - 1 && (
                    <div
                      className={`h-1 mx-auto mt-2
                        ${isCompleted
                          ? "bg-black"
                          : "bg-gray-300"}
                      `}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/*  ITEMS */}
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

        {/*  TOTAL */}
        <p className="font-bold">
          Total: ₹{order.total}
        </p>
      </div>

      {/*  SHOP NOW */}
      <div className="flex justify-center items-center mt-16">
        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-6 py-3 rounded hover:opacity-90"
        >
          Shop Now
        </button>
      </div>
    </div>
  )
}

export default OrderDetails
