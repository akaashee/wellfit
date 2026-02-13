import { FaHeart } from "react-icons/fa"
import {  useStore } from "../context/StoreContext"
import { useLocation, useNavigate } from "react-router-dom"

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const {pathname} = useLocation()
  
  const { addToCart, toggleWishlist, wishlist } = useStore()

  console.log(wishlist);
  

  const defaultWeight = product.weights[0]

  const isWishlisted = wishlist?.some(
    item => item.productId === product.id
  )

  return (
    <div
      className="
        relative
        rounded-xl
        p-4
        border
        border-gray-400
      "
    >
      {/* WISHLIST ICON */}
      <button
        onClick={() => toggleWishlist(product)}
        className={`absolute top-3 right-3 z-10 text-xl transition-colors ${
          isWishlisted ? "text-red-500" : "text-gray-400"
        }`}
      >
        <FaHeart />
      </button>

      {/* IMAGE */}
      <div
        onClick={() => navigate(`/products/${product.id}`)}
        className="
          cursor-pointer
          overflow-hidden
          rounded-lg
        "
      >
        <img
          src={product.image}
          alt={product.title}
          className="
            h-48
            w-full
            object-contain
            transition-transform
            duration-300
            ease-in-out
            hover:scale-105
          "
        />
      </div>

      {/* DETAILS */}
      <h3 className="font-bold text-lg mt-4 mb-1">
        {product.title}
      </h3>

      <p className="text-gray-500 text-sm mb-2">
        {defaultWeight.weight}
      </p>

      <p className="font-bold text-lg ">
        ₹{defaultWeight.price}
      </p>

      {/* ADD TO CART */}
      <button
        onClick={() => pathname === "/products" ? addToCart(product, defaultWeight) : navigate(`/products/${product.id}`)}
        className="
          absolute
          bottom-4
          right-4
          p-3
          border
          rounded-2xl
          transition-all
          duration-300
          ease-in-out
          hover:scale-110
          hover:bg-black
          hover:text-white
        "
      >
        {pathname === "/products" ? "Add to Cart" : "View Details"}
      </button>
    </div>
  )
}

export default ProductCard
