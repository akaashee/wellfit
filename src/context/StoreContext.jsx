import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "./AuthContext"
import { toast } from "react-toastify"

export const StoreContext = createContext(null)

const BASE_URL = "http://localhost:3001"

const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [toastMessage, setToastMessage] = useState("")

  const { user } = useAuth()
  const userId = user?.id

  /* TOAST */
  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(""), 2000)
  }

  /*  LOAD CART & WISHLIST */
  useEffect(() => {
    if (!userId) {
      setCart([])
      setWishlist([])
      return
    }

    const loadData = async () => {
      try {
        const [cartRes, wishlistRes] = await Promise.all([
          axios.get(`${BASE_URL}/cart?userId=${userId}`),
          axios.get(`${BASE_URL}/wishlist?userId=${userId}`)
        ])

        setCart(cartRes.data)
        setWishlist(wishlistRes.data)
      } catch (err) {
        console.error("Failed to load store data", err)
      }
    }

    loadData()
  }, [userId])

  /* PLACE ORDER */
  const placeOrder = async (customer) => {
    if (!userId || cart.length === 0) return null

    try {
      const order = {
        userId,
        customer,
        items: cart,
        total: cart.reduce(
          (sum, item) => sum + item.price * item.qty,
          0
        ),
        status: "Order Placed",
        createdAt: new Date().toISOString()
      }

      const res = await axios.post(`${BASE_URL}/orders`, order)
      const orderId = res.data.id

      await Promise.all(
        cart.map(item =>
          axios.delete(`${BASE_URL}/cart/${item.id}`)
        )
      )

      setCart([])
      showToast("Order placed successfully ")
      return orderId
    } catch (error) {
      console.error("Order failed:", error)
      showToast("Order failed ")
      return null
    }
  }

  /*  ADD TO CART */
  const addToCart = async (product, selectedWeight) => {
    if (!userId) {
      toast.error("Login to add items to cart")
      return
    }
    const existing = cart.find(
      i =>
        i.productId === product.id &&
        i.weight === selectedWeight.weight
    )

    if (existing) {
      await axios.patch(`${BASE_URL}/cart/${existing.id}`, {
        qty: existing.qty + 1
      })

      setCart(prev =>
        prev.map(i =>
          i.id === existing.id
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      )
    } else {
      const res = await axios.post(`${BASE_URL}/cart`, {
        userId,
        productId: product.id,
        title: product.title,
        image: product.image,
        weight: selectedWeight.weight,
        price: selectedWeight.price,
        qty: 1
      })

      setCart(prev => [...prev, res.data])
    }

    toast.success("Added to cart")
  }

  /* CART QTY */
  const increaseQty = async (id) => {
    const item = cart.find(i => i.id === id)
    if (!item) return

    await axios.patch(`${BASE_URL}/cart/${id}`, {
      qty: item.qty + 1
    })

    setCart(prev =>
      prev.map(i =>
        i.id === id ? { ...i, qty: i.qty + 1 } : i
      )
    )
  }

  const decreaseQty = async (id) => {
    const item = cart.find(i => i.id === id)
    if (!item || item.qty === 1) return

    await axios.patch(`${BASE_URL}/cart/${id}`, {
      qty: item.qty - 1
    })

    setCart(prev =>
      prev.map(i =>
        i.id === id ? { ...i, qty: i.qty - 1 } : i
      )
    )
  }

  const removeFromCart = async (id) => {
    await axios.delete(`${BASE_URL}/cart/${id}`)
    setCart(prev => prev.filter(i => i.id !== id))
    toast.warning('Removed from cart')
  }

  /*  WISHLIST — ADD ONLY ONCE */
  const toggleWishlist = async (product) => {

    if (!userId) {
      toast.error("Login to manage wishlist")
      return
    }


    //  STRICT CHECK (state + DB safe)
    const exists = wishlist.some(
      i => i?.productId === product?.productId || i?.productId === product?.id
    )

    console.log(exists);


    if (exists) {
      // REMOVE
      const item = wishlist.find(
        i => i?.productId === product?.productId || i?.productId === product?.id
      )

      await axios.delete(`${BASE_URL}/wishlist/${item.id}`)
      setWishlist(prev =>
        prev.filter(i => i.id !== item.id)
      )
      toast.warning('Removed from wishlist')
      return
    }

    // ADD (ONLY IF NOT EXISTS)
    const res = await axios.post(`${BASE_URL}/wishlist`, {
      userId,
      productId: product.id,
      title: product.title,
      image: product.image
    })

    setWishlist(prev => [...prev, res.data])
    toast.success('Added to wishlist')
  }

  /*  TOTAL PRICE */
  const totalPrice = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  )

  /*  CART COUNT */
  const cartCount = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  )

  /*  CLEAR STORE */
  const clearStore = () => {
    setCart([])
    setWishlist([])
  }

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        toggleWishlist,
        totalPrice,
        cartCount,
        toastMessage,
        clearStore,
        placeOrder
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

/* CUSTOM HOOK */
export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used inside StoreProvider")
  }
  return context
}

export default StoreProvider
