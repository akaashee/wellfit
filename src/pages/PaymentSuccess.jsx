import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { StoreContext } from "../context/StoreContext"

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const { setCart } = useContext(StoreContext)

  useEffect(() => {
    // clear cart after payment
    setCart([])
  }, [])

  return (
    <div className="h-[70vh] flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        Payment Successful 
      </h1>

      <p className="text-gray-600 mb-6">
        Thank you for shopping with WELLFIT
      </p>

      <button
        onClick={() => navigate("/products")}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Continue Shopping
      </button>
    </div>
  )
}

export default PaymentSuccess
