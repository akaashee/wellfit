import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { StoreContext } from "../context/StoreContext"

const OrderSuccess = () => {
  const { cart } = useContext(StoreContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/")
    }
  }, [])

  return (
    <div className="h-[70vh] flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Order Placed Successfully 
      </h1>

      <p className="mb-6">
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

export default OrderSuccess
