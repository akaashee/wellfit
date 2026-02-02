import { createContext, useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "./AuthContext"

export const StoreContext = createContext(null)

const BASE_URL = "http://localhost:3001"

const StoreProvider = ({ children }) => {
  const { user } = useAuth()
  const userId = user?.id

  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [toastMessage, setToastMessage] = useState("")

  /*  TOAST */
  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(""), 2000)
  }

  /*  LOAD CART FROM DB */
  useEffect(() => {
    if (!userId) {
      setCart([])
      return
    }

    axios
      .get(`${BASE_URL}/cart?userId=${userId}`)
      .then(res => setCart(res.data))
  }, [userId])

  /*  LOAD WISHLIST (PER USER) */
  useEffect(() => {
    if (!userId) {
      setWishlist([])
      return
    }

    const saved = localStorage.getItem(`wishlist_${userId}`)
    setWishlist(saved ? JSON.parse(saved) : [])
  }, [userId])

  /*  SAVE WISHLIST */
  useEffect(() => {
    if (userId) {
      localStorage.setItem(
        `wishlist_${userId}`,
        JSON.stringify(wishlist)
      )
    }
  }, [wishlist, userId])

  /*  ADD TO CART */
  const addToCart = async (product, selectedWeight) => {
    if (!userId) {
      showToast("Please login first")
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

    showToast("Added to cart 🛒")
  }

  /*  QTY */
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
  }

  /*  WISHLIST */
  const toggleWishlist = (product) => {
    const exists = wishlist.find(i => i.id === product.id)

    if (exists) {
      setWishlist(prev => prev.filter(i => i.id !== product.id))
      showToast("Removed from wishlist")
    } else {
      setWishlist(prev => [...prev, product])
      showToast("Added to wishlist ")
    }
  }

  /*  CLEAR STORE (LOGOUT) */
  const clearStore = () => {
    setCart([])
    setWishlist([])
  }

  /* TOTAL */
  const totalPrice = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  )

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
        clearStore,
        totalPrice,
        toastMessage
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export default StoreProvider
