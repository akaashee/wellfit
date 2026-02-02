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
      navigate(`/order/${orderId}`)
    } catch {
      alert("Payment failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      {/*  CUSTOMER DETAILS */}
      <div className="mb-6">
        <input
          placeholder="Name"
          className="border p-2 mb-3 w-full"
          onChange={e => setCustomer({ ...customer, name: e.target.value })}
        />

        <input
          placeholder="Phone"
          className="border p-2 mb-3 w-full"
          onChange={e => setCustomer({ ...customer, phone: e.target.value })}
        />

        <textarea
          placeholder="Address"
          className="border p-2 w-full"
          onChange={e => setCustomer({ ...customer, address: e.target.value })}
        />
      </div>

      {/*  PAYMENT METHODS */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Payment Method</h3>

        <label className="block mb-2">
          <input
            type="radio"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={e => setPaymentMethod(e.target.value)}
          />{" "}
          Cash on Delivery
        </label>

        <label className="block mb-2">
          <input
            type="radio"
            value="UPI"
            checked={paymentMethod === "UPI"}
            onChange={e => setPaymentMethod(e.target.value)}
          />{" "}
          UPI
        </label>

        <label className="block">
          <input
            type="radio"
            value="CARD"
            checked={paymentMethod === "CARD"}
            onChange={e => setPaymentMethod(e.target.value)}
          />{" "}
          Credit / Debit Card
        </label>
      </div>

      {/*  UPI INPUT (ONLY WHEN UPI SELECTED) */}
      {paymentMethod === "UPI" && (
        <div className="mb-6 border p-4">
          <h4 className="font-semibold mb-3">UPI Details</h4>

          <input
            type="text"
            placeholder="example@upi"
            className="border p-2 w-full"
            value={upiId}
            onChange={e => setUpiId(e.target.value)}
          />
        </div>
      )}

      {/*  CARD INPUTS (ONLY WHEN CARD SELECTED) */}
      {paymentMethod === "CARD" && (
        <div className="mb-6 border p-4">
          <h4 className="font-semibold mb-3">Card Details</h4>

          <input
            type="text"
            placeholder="Card Number"
            maxLength={16}
            className="border p-2 mb-3 w-full"
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
              className="border p-2 w-1/2"
              value={card.expiry}
              onChange={e =>
                setCard({ ...card, expiry: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="CVV"
              maxLength={3}
              className="border p-2 w-1/2"
              value={card.cvv}
              onChange={e =>
                setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") })
              }
            />
          </div>
        </div>
      )}

      {/*  PLACE ORDER */}
      <button
        onClick={handlePay}
        disabled={loading}
        className="bg-black text-white px-6 py-3 w-full"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  )
}

export default Checkout
