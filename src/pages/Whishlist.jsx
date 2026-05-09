import { useContext } from "react"
import { StoreContext } from "../context/StoreContext"
import { Link } from "react-router-dom"

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useContext(StoreContext)
  
  if (wishlist.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-3">
          Wishlist is Empty
        </h2>

        <Link
          to="/products"
          className="bg-black text-white px-6 py-2 rounded border hover:bg-white hover:text-black"
        >
          Shop Now
        </Link>
      </div>
    )
  }

 return (
  <div className="min-h-screen bg-black py-24">
    <div className="max-w-6xl mx-auto px-6">

      <h1 className="text-3xl font-semibold text-white mb-12 tracking-wide">
        MY WISHLIST
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {wishlist.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-48 w-full object-contain mb-6"
            />

            <h3 className="font-semibold text-black mb-4 leading-snug">
              {item.title}
            </h3>

            <div className="flex justify-between items-center mt-auto">

              <Link
                to={`/products/${item.productId}`}
                className="text-black font-medium hover:underline"
              >
                View
              </Link>

              <button
                onClick={() => toggleWishlist(item)}
                className="text-gray-500 text-sm hover:text-black transition"
              >
                Remove
              </button>

            </div>
          </div>
        ))}
      </div>

    </div>
  </div>
)
}

export default Wishlist
