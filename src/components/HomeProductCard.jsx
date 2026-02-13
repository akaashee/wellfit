import { useContext, useState } from "react"
import { StoreContext } from "../context/StoreContext"
import { useNavigate } from "react-router-dom"
import Toast from "./Toast"

const HomeProductCard = ({ product }) => {
  const { addToCart } = useContext(StoreContext)
  const isAuth = localStorage.getItem("isAuth")
  const navigate = useNavigate()
  const [toast, setToast] = useState("")

  const handleAddToCart = () => {
    if (!isAuth) {
      setToast("Please login")
      setTimeout(() => setToast(""), 2000)
      return
    }
    addToCart(product)
  }

  const handleNavigate = () => {
    if (!isAuth) navigate("/login") 
    else navigate(`/products/${product.id}`)
  }

  return (
    <div className="border-2">
      <Toast message={toast} />

      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition flex flex-col ">
        <img
          src={product.image}
          alt={product.title}
          onClick={handleNavigate}
          className="h-48 w-full object-contain cursor-pointer"
        />

        <h3
          onClick={handleNavigate}
          className="mt-4 font-bold text-lg cursor-pointer"
        >
          {product.title}
        </h3>

        <p className="text-green-600 font-semibold mt-1">
          ₹{product.price}
        </p>

        <button
          onClick={handleAddToCart}
          className="border py-2 rounded-lg mt-4"
        >
          View Details
        </button>
      </div>
    </div>
  )
}

export default HomeProductCard
