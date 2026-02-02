import { useEffect, useState, useContext } from "react"
import { useParams } from "react-router-dom"
import API from "../services/API"
import { StoreContext } from "../context/StoreContext"
import { FaHeart } from "react-icons/fa"

const ProductDetails = () => {
  const { id } = useParams()

  const {
    addToCart,
    toggleWishlist,
    wishlist
  } = useContext(StoreContext)

  const [product, setProduct] = useState(null)
  const [selectedWeight, setSelectedWeight] = useState(null)
  const [activeImage, setActiveImage] = useState("")

  // 🔄 Fetch product
  useEffect(() => {
    API.get(`/products/${id}`).then(res => {
      setProduct(res.data)
      setSelectedWeight(res.data.weights[0])
      setActiveImage(res.data.image)
    })
  }, [id])

  if (!product || !selectedWeight) {
    return (
      <div className="h-[60vh] flex justify-center items-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    )
  }

  const isWishlisted = wishlist.some(
    item => item.id === product.id
  )

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">

        {/* IMAGE */}
        <div className="border rounded-lg p-6">
          <img
            src={activeImage}
            alt={product.title}
            className="w-full h-96 object-contain"
          />
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-bold mb-4">
            {product.title}
          </h1>

          <p className="text-gray-600 mb-6">
            {product.description}
          </p>

          {/* WEIGHT SELECT */}
          <label className="block mb-2 font-semibold">
            Select Weight
          </label>

          <select
            className="border border-black p-2 mb-4 w-full"
            value={selectedWeight.weight}
            onChange={(e) =>
              setSelectedWeight(
                product.weights.find(
                  w => w.weight === e.target.value
                )
              )
            }
          >
            {product.weights.map(w => (
              <option key={w.weight} value={w.weight}>
                {w.weight}
              </option>
            ))}
          </select>

          {/* PRICE */}
          <p className="text-2xl font-bold mb-6">
            ₹ {selectedWeight.price}
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">

            <button
              onClick={() =>
                addToCart(product, selectedWeight)
              }
              className="bg-black text-white px-8 py-3 rounded hover:bg-green-600 transition"
            >
              Add to Cart
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`border px-5 py-3 rounded flex items-center gap-2 transition ${
                isWishlisted
                  ? "text-red-500 border-red-500"
                  : "border-black"
              }`}
            >
              <FaHeart />
              {isWishlisted
                ? "Wishlisted"
                : "Add to Wishlist"}
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}

export default ProductDetails
