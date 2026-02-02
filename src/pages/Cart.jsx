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
          className="bg-black text-white px-6 py-3 rounded"
        >
          Shop Now
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8">Your Cart</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {/* CART ITEMS */}
        <div className="md:col-span-2 space-y-4">
          {cart.map(item => (
            <div
              key={item.id}
              className="flex gap-4 items-center border rounded-lg p-4"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-contain bg-white p-2 border"
              />

              <div className="flex-1">
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-gray-500">
                  Weight: {item.weight}
                </p>

                <p className="text-green-600 font-semibold">
                  ₹{item.price}
                </p>

                {/* QTY CONTROLS */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    disabled={item.qty === 1}
                    onClick={() => decreaseQty(item.id)}
                    className="px-3 py-1 border rounded"
                  >
                    −
                  </button>

                  <span className="font-semibold">
                    {item.qty}
                  </span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-3 py-1 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* SUBTOTAL + REMOVE */}
              <div className="text-right">
                <p className="font-semibold">
                  ₹{item.price * item.qty}
                </p>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-sm mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div className="border rounded-lg p-6 h-fit">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>

          <div className="space-y-3 mb-4">
            {cart.map(item => (
              <div
                key={item.id}
                className="flex justify-between text-sm"
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

          <hr className="my-4" />

          <div className="flex justify-between mb-2">
            <span>Total Items</span>
            <span>
              {cart.reduce((sum, i) => sum + i.qty, 0)}
            </span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Total Price</span>
            <span className="font-bold">
              ₹{totalPrice}
            </span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-green-500 text-white py-2 rounded"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart
