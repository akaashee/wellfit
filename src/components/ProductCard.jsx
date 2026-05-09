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
      bg-white
      rounded-2xl
      p-6
      shadow-md
      hover:shadow-xl
      transition-all
      duration-300
    "
  >
    {/* WISHLIST ICON */}
    <button
      onClick={() => toggleWishlist(product)}
      className={`absolute top-4 right-4 text-lg transition ${
        isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
      }`}
    >
      <FaHeart />
    </button>

    {/* IMAGE */}
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="cursor-pointer overflow-hidden rounded-xl mb-6"
    >
      <img
        src={product.image}
        alt={product.title}
        className="
          h-52
          w-full
          object-contain
          transition-transform
          duration-300
          hover:scale-105
        "
      />
    </div>

    {/* DETAILS */}
    <h3 className="font-semibold text-black text-base leading-snug mb-2">
      {product.title}
    </h3>

    <p className="text-gray-500 text-sm mb-2">
      {defaultWeight.weight}
    </p>

    <p className="font-bold text-lg text-black mb-6">
      ₹{defaultWeight.price}
    </p>

    {/* BUTTON */}
    <button
      onClick={() =>
        pathname === "/products"
          ? addToCart(product, defaultWeight)
          : navigate(`/products/${product.id}`)
      }
      className="
        w-full
        py-3
        border
        border-black
        text-black
        rounded-lg
        text-sm
        font-medium
        transition
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
