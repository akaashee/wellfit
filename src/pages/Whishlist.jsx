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
          className="bg-black text-white px-6 py-2 rounded"
        >
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">
        My Wishlist
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map(item => (
          <div key={item.id} className="border p-4 rounded">
            <img
              src={item.image}
              className="h-40 w-full object-contain mb-3"
            />

            <h3 className="font-bold mb-2">
              {item.title}
            </h3>

            <div className="flex justify-between">
              <Link
                to={`/products/${item.productId}`}
                className="text-green-600"
              >
                View
              </Link>

              <button
                onClick={() => toggleWishlist(item)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist
