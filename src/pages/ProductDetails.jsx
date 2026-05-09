import { useEffect, useState, useContext } from "react"
import { useParams } from "react-router-dom"
import API from "../services/API"
import { StoreContext } from "../context/StoreContext"


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

  //  Fetch product
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
  <div className="min-h-screen bg-black py-24">
    <div className="max-w-6xl mx-auto px-6">

      <div className="bg-white rounded-2xl shadow-xl p-10 grid md:grid-cols-2 gap-16">

        {/* IMAGE */}
        <div className="flex items-center justify-center">
          <img
            src={activeImage}
            alt={product.title}
            className="w-full max-h-[450px] object-contain"
          />
        </div>

        {/* DETAILS */}
        <div className="flex flex-col justify-center">

          <h1 className="text-3xl font-semibold text-black mb-4 leading-snug">
            {product.title}
          </h1>

          <p className="text-gray-600 mb-8 leading-relaxed text-sm">
            {product.description}
          </p>

          {/* WEIGHT SELECT */}
          <label className="block mb-2 text-sm font-medium text-black">
            Select Weight
          </label>

          <select
            className="border border-gray-300 rounded-md px-4 py-2 mb-6 w-full text-black focus:outline-none focus:border-black transition"
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
          <p className="text-2xl font-bold text-black mb-8">
            ₹ {selectedWeight.price}
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">

            <button
              onClick={() =>
                addToCart(product, selectedWeight)
              }
              className="hover:bg-black hover:text-white text-black px-8 py-3 rounded-md text-sm font-medium transition border border-black"
            >
              Add to Cart
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`px-6 py-3 rounded-md text-sm font-medium border transition ${
                isWishlisted
                  ? "bg-black text-white border-black"
                  : "border-black text-black hover:bg-black hover:text-white"
              }`}
            >
              {isWishlisted
                ? "Wishlisted"
                : "Add to Wishlist"}
            </button>

          </div>

        </div>

      </div>

    </div>
  </div>
)
}

export default ProductDetails
