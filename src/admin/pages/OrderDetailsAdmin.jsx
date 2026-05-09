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
  CubeIcon, // ✅ NEW ICON for "Shipped"
} from "@heroicons/react/24/outline"

/* ===== ORDER STEPS ===== */
const ORDER_STEPS = [
  "Order Placed",
  "Shipped", // ✅ changed
  "Out for Delivery",
  "Delivered",
]

const OrderDetailsAdmin = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const [status, setStatus] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then(res => {
        setOrder(res.data)
        setStatus(res.data.status)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSaveStatus = async () => {
    try {
      setSaving(true)
      const res = await API.patch(`/orders/${id}`, { status })
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

  // ✅ optional safety if backend still sends "Packed"
  const normalizedStatus =
    order.status === "Packed" ? "Shipped" : order.status

  const currentStep = ORDER_STEPS.indexOf(normalizedStatus)

  return (
    <div className="space-y-8">

      <Link
        to="/admin/orders"
        className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back to Orders
      </Link>

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">

        <div>
          <h1 className="text-2xl font-semibold text-white">
            Order #{order.id}
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Placed on {new Date(order.createdAt).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md px-5 py-3 flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">
            Status
          </span>

          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="text-black border border-gray-300 px-3 py-1.5 rounded-md text-sm focus:outline-none focus:border-black transition"
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
            className="px-4 py-1.5 rounded-md bg-black text-white text-sm hover:opacity-85 disabled:opacity-50 transition"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-8">

          {/* ===== ORDER STATUS TRACKER ===== */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="font-semibold text-black mb-8">
              Order Status
            </h2>

            <div className="flex items-center justify-between relative">

              {/* FULL BLACK LINE */}
              <div className="absolute top-5 left-0 right-0 h-[2px] bg-black" />

              {ORDER_STEPS.map((step, index) => {
                const isCompleted = index < currentStep

                // ✅ updated icons
                const StepIcon =
                  index === 1
                    ? CubeIcon        // Shipped 📦
                    : index === 2
                    ? TruckIcon       // Out for delivery 🚚
                    : index === 3
                    ? HomeIcon        // Delivered 🏠
                    : CheckIcon       // Order placed

                return (
                  <div
                    key={step}
                    className="flex flex-col items-center relative z-10"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition ${
                        index <= currentStep
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckIcon className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>

                    <p
                      className={`mt-3 text-xs font-medium ${
                        index <= currentStep
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

          {/* ITEMS (unchanged) */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="font-semibold text-black mb-6">
              Items in Order
            </h2>

            {order.items.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-gray-100 pb-5 mb-5 last:border-0 last:mb-0"
              >
                <div className="flex items-center gap-5">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                  />

                  <div>
                    <p className="font-medium text-black">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Qty: {item.qty}
                    </p>
                  </div>
                </div>

                <p className="font-semibold text-black">
                  ₹{item.price * item.qty}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT SIDE unchanged */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="font-semibold text-black mb-6 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-black" />
              Shipping Details
            </h2>

            <p className="font-medium text-black">
              {order.shipping?.name}
            </p>
            <p className="text-sm text-black mt-2">
              {order.shipping?.address}
            </p>
            <p className="text-sm text-black">
              {order.shipping?.city}
            </p>
            <p className="text-sm text-black">
              {order.shipping?.phone}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="font-semibold text-black mb-6 flex items-center gap-2">
              <CreditCardIcon className="w-5 h-5" />
              Payment Info
            </h2>

            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-500">Method</span>
              <span className="font-medium text-black">
                {order.payment?.method}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Card Holder</span>
              <span className="font-medium text-black">
                {order.payment?.cardHolder}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="font-semibold text-black mb-6">
              Order Summary
            </h2>

            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-black">₹{order.total}</span>
            </div>

            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-500">Shipping</span>
              <span className="text-black">Free</span>
            </div>

            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-500">Tax</span>
              <span className="text-black">₹0</span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between font-semibold text-black">
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