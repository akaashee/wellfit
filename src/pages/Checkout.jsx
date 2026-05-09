import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { StoreContext } from "../context/StoreContext"

const Checkout = () => {
  const { cart, placeOrder } = useContext(StoreContext)
  const navigate = useNavigate()

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: ""
  })

  const [paymentMethod, setPaymentMethod] = useState("COD")
  const [loading, setLoading] = useState(false)

  //  CARD DETAILS
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: ""
  })

  //  UPI DETAILS
  const [upiId, setUpiId] = useState("")

  const handlePay = async () => {
    //  CUSTOMER VALIDATION
    if (!customer.name || !customer.phone || !customer.address) {
      alert("Fill all customer details")
      return
    }

    //  CART VALIDATION
    if (cart.length === 0) {
      alert("Cart is empty")
      return
    }

    //  CARD VALIDATION
    if (paymentMethod === "CARD") {
      if (
        card.number.length !== 16 ||
        !/^\d+$/.test(card.number) ||
        !/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry) ||
        card.cvv.length !== 3
      ) {
        alert("Enter valid card details")
        return
      }
    }

    //  UPI VALIDATION
    if (paymentMethod === "UPI") {
      const upiRegex = /^[\w.\-]{2,}@[a-zA-Z]{2,}$/
      if (!upiRegex.test(upiId)) {
        alert("Enter valid UPI ID")
        return
      }
    }

    setLoading(true)

    try {
      //  MOCK PAYMENT DELAY
      if (paymentMethod !== "COD") {
        await new Promise(res => setTimeout(res, 1500))
      }

      const orderId = await placeOrder(customer, paymentMethod)
      navigate(`/payment-success`)
    } catch {
      alert("Payment failed")
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className="min-h-screen bg-black py-24">
    <div className="max-w-4xl mx-auto px-6">

      <div className="bg-white rounded-2xl shadow-xl p-10">

        <h2 className="text-3xl font-semibold text-black mb-10 tracking-wide">
          CHECKOUT
        </h2>

        {/* CUSTOMER DETAILS */}
        <div className="mb-10 space-y-4">
          <input
            placeholder="Full Name"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-black focus:outline-none focus:border-black transition"
            onChange={e => setCustomer({ ...customer, name: e.target.value })}
          />

          <input
            placeholder="Phone Number"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-black focus:outline-none focus:border-black transition"
            onChange={e => setCustomer({ ...customer, phone: e.target.value })}
          />

          <textarea
            placeholder="Full Address"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-black focus:outline-none focus:border-black transition resize-none"
            rows="3"
            onChange={e => setCustomer({ ...customer, address: e.target.value })}
          />
        </div>

        {/* PAYMENT METHOD */}
        <div className="mb-10">
          <h3 className="text-lg font-medium text-black mb-4">
            Payment Method
          </h3>

          <div className="space-y-3 text-black text-sm">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={e => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={e => setPaymentMethod(e.target.value)}
              />
              UPI
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                value="CARD"
                checked={paymentMethod === "CARD"}
                onChange={e => setPaymentMethod(e.target.value)}
              />
              Credit / Debit Card
            </label>
          </div>
        </div>

        {/* UPI INPUT */}
        {paymentMethod === "UPI" && (
          <div className="mb-10 border border-gray-200 rounded-lg p-6">
            <h4 className="font-medium text-black mb-4">
              UPI Details
            </h4>

            <input
              type="text"
              placeholder="example@upi"
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-black focus:outline-none focus:border-black transition"
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
            />
          </div>
        )}

        {/* CARD INPUTS */}
        {paymentMethod === "CARD" && (
          <div className="mb-10 border border-gray-200 rounded-lg p-6">
            <h4 className="font-medium text-black mb-4">
              Card Details
            </h4>

            <input
              type="text"
              placeholder="Card Number"
              maxLength={16}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-black mb-4 focus:outline-none focus:border-black transition"
              value={card.number}
              onChange={e =>
                setCard({ ...card, number: e.target.value.replace(/\D/g, "") })
              }
            />

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                className="w-1/2 border border-gray-300 rounded-md px-4 py-3 text-black focus:outline-none focus:border-black transition"
                value={card.expiry}
                onChange={e =>
                  setCard({ ...card, expiry: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="CVV"
                maxLength={3}
                className="w-1/2 border border-gray-300 rounded-md px-4 py-3 text-black focus:outline-none focus:border-black transition"
                value={card.cvv}
                onChange={e =>
                  setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") })
                }
              />
            </div>
          </div>
        )}

        {/* PLACE ORDER BUTTON */}
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-md font-medium transition hover:opacity-85 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>

      </div>
    </div>
  </div>
)
}

export default Checkout
