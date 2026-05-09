import { useNavigate } from "react-router-dom"
import { useStore } from "../context/StoreContext"

const Cart = () => {
  const navigate = useNavigate()

  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    totalPrice
  } = useStore()
  

  //  EMPTY CART UI
  if (cart.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-2">
          Your Cart is Empty
        </h2>

        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-6 py-3 rounded border hover:bg-white hover:text-black"
        >
          Shop Now
        </button>
      </div>
    )
  }

  return (
  <div className="min-h-screen bg-black py-20">
    <div className="max-w-6xl mx-auto px-6">

      <h2 className="text-3xl font-bold text-white mb-12 tracking-wide">
        YOUR CART
      </h2>

      <div className="grid md:grid-cols-3 gap-10">

        {/* CART ITEMS */}
        <div className="md:col-span-2 space-y-6">
          {cart.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-6 shadow-md flex gap-6 items-center"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-contain bg-white"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-black">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500 mb-2">
                  Weight: {item.weight}
                </p>

                <p className="font-bold text-black">
                  ₹{item.price}
                </p>

                {/* QTY CONTROLS */}
                <div className="flex items-center gap-4 mt-4">
                  <button
                    disabled={item.qty === 1}
                    onClick={() => decreaseQty(item.id)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-black hover:bg-black hover:text-white transition"
                  >
                    −
                  </button>

                  <span className="font-semibold text-black">
                    {item.qty}
                  </span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-black hover:bg-black hover:text-white transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* SUBTOTAL + REMOVE */}
              <div className="text-right">
                <p className="font-bold text-black">
                  ₹{item.price * item.qty}
                </p>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-sm text-gray-500 mt-2 hover:text-black transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white rounded-xl p-8 shadow-md h-fit">
          <h3 className="text-xl font-semibold text-black mb-6">
            Order Summary
          </h3>

          <div className="space-y-4 mb-6">
            {cart.map(item => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-black"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-gray-500">
                    {item.weight} × {item.qty}
                  </p>
                </div>

                <p className="font-semibold">
                  ₹{item.price * item.qty}
                </p>
              </div>
            ))}
          </div>

          <hr className="border-gray-200 my-6" />

          <div className="flex justify-between text-black mb-3">
            <span>Total Items</span>
            <span>
              {cart.reduce((sum, i) => sum + i.qty, 0)}
            </span>
          </div>

          <div className="flex justify-between text-black mb-6">
            <span>Total Price</span>
            <span className="font-bold">
              ₹{totalPrice}
            </span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="text-black w-full border border-black hover:bg-black hover:text-white py-3 rounded-md font-medium transition "
          >
            Proceed to Checkout
          </button>
        </div>

      </div>
    </div>
  </div>
)
}

export default Cart
