import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import API from "../../services/API"
import {
  ArrowLeftIcon,
  MapPinIcon,
  CreditCardIcon,
  CheckIcon,
  TruckIcon,
  HomeIcon,
} from "@heroicons/react/24/outline"

/* ===== ORDER STEPS ===== */
const ORDER_STEPS = [
  "Order Placed",
  "Packed",
  "Out for Delivery",
  "Delivered",
]

const OrderDetailsAdmin = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const [status, setStatus] = useState("")
  const [saving, setSaving] = useState(false)

  /* =====================
      FETCH ORDER
  ====================== */
  useEffect(() => {
    API.get(`/orders/${id}`)
      .then(res => {
        setOrder(res.data)
        setStatus(res.data.status)
      })
      .finally(() => setLoading(false))
  }, [id])

  /* =====================
      SAVE STATUS
  ====================== */
  const handleSaveStatus = async () => {
    try {
      setSaving(true)

      //  Update order status in backend
      const res = await API.patch(`/orders/${id}`, {
        status,
      })

      //  Update UI with latest data
      setOrder(res.data)
    } catch (error) {
      console.error("Failed to update order status", error)
      alert("Failed to update order status")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-center mt-10">Loading order...</p>
  }

  if (!order) {
    return <p className="text-center mt-10">Order not found</p>
  }

  const currentStep = ORDER_STEPS.indexOf(order.status)

  return (
    <div className="space-y-6">
      {/* BACK */}
      <Link
        to="/admin/orders"
        className="flex items-center gap-2 text-gray-500 hover:text-black"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back to Orders
      </Link>

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">
            Order #{order.id}
          </h1>
          <p className="text-gray-500 mt-1">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleString("en-IN")}
          </p>
        </div>

        {/* STATUS CONTROL */}
        <div className="flex items-center gap-3 border rounded-lg px-4 py-2">
          <span className="font-medium">Status:</span>

          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="outline-none bg-transparent"
          >
            {ORDER_STEPS.map(step => (
              <option key={step} value={step}>
                {step}
              </option>
            ))}
          </select>

          <button
            onClick={handleSaveStatus}
            disabled={saving || status === order.status}
            className="px-4 py-1 rounded bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* ORDER STATUS TRACKER */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold mb-6">Order Status</h2>

            <div className="flex items-center justify-between relative">
              {/* BACKGROUND LINE */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200" />

              {/* PROGRESS LINE */}
              <div
                className="absolute top-5 left-0 h-1 bg-green-500 transition-all"
                style={{
                  width:
                    currentStep >= 0
                      ? `${(currentStep / (ORDER_STEPS.length - 1)) * 100}%`
                      : "0%",
                }}
              />

              {ORDER_STEPS.map((step, index) => {
                const isCompleted = index <= currentStep

                const Icon =
                  index === 0
                    ? CheckIcon
                    : index === 1
                    ? CheckIcon
                    : index === 2
                    ? TruckIcon
                    : HomeIcon

                return (
                  <div
                    key={step}
                    className="flex flex-col items-center relative z-10"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <p
                      className={`mt-2 text-sm font-medium ${
                        isCompleted
                          ? "text-black"
                          : "text-gray-400"
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ITEMS */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold mb-4">Items in Order</h2>

            {order.items.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4 mb-4 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />

                  <div>
                    <p className="font-semibold">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.qty}
                    </p>
                  </div>
                </div>

                <p className="font-semibold">
                  ₹{item.price * item.qty}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* SHIPPING */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5" />
              Shipping Details
            </h2>

            <p className="font-medium">{order.shipping?.name}</p>
            <p className="text-sm text-gray-500">
              {order.shipping?.address}
            </p>
            <p className="text-sm text-gray-500">
              {order.shipping?.city}
            </p>
            <p className="text-sm text-gray-500">
              {order.shipping?.phone}
            </p>
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <CreditCardIcon className="w-5 h-5" />
              Payment Info
            </h2>

            <div className="flex justify-between">
              <span className="text-gray-500">Method</span>
              <span className="font-medium">
                {order.payment?.method}
              </span>
            </div>

            <div className="flex justify-between mt-2">
              <span className="text-gray-500">Card Holder</span>
              <span className="font-medium">
                {order.payment?.cardHolder}
              </span>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold mb-4">Order Summary</h2>

            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Subtotal</span>
              <span>₹{order.total}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Shipping</span>
              <span className="text-green-600">Free</span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Tax</span>
              <span>₹0</span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsAdmin
