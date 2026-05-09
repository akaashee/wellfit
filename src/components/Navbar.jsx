import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useStore } from "../context/StoreContext"
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaSearch
} from "react-icons/fa"


const Navbar = () => {
  const navigate = useNavigate()
  const isAuth = Boolean(localStorage.getItem("isAuth"))


  const { cart, wishlist, clearStore } = useStore()



  const [search, setSearch] = useState("")

  const logout = () => {
    localStorage.removeItem("isAuth")
    localStorage.removeItem("user")
    clearStore()
    navigate("/login")
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setSearch(value)
    navigate(
      value.trim()
        ? `/products?search=${value}`
        : "/products"
    )
  }

  return (
  <nav className="sticky top-0 z-50 bg-black border-b border-gray-800">
  <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between text-white">

    {/* Logo */}
    <Link 
      to="/" 
      className="text-2xl font-bold tracking-widest text-white hover:opacity-80 hover:text-green-500 transition"
    >
      WELLFIT
    </Link>

    {/* Search */}
    {isAuth && (
      <div className="hidden md:flex items-center bg-gray-900 border border-gray-700 rounded-md px-4 py-1.5 focus-within:border-white transition">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          value={search}
          onChange={handleSearch}
          placeholder="Search products..."
          className="bg-transparent py-1 w-56 text-white placeholder-gray-500 outline-none text-sm"
        />
      </div>
    )}

    {/* Right Side */}
    {isAuth ? (
      <div className="flex items-center gap-8 text-sm font-medium">

        <Link 
          to="/products" 
          className="hover:text-gray-300 transition"
        >
          Products
        </Link>

        {/* Wishlist */}
        <Link 
          to="/wishlist" 
          className="relative hover:text-gray-300 transition"
        >
          <FaHeart size={18} />
          {wishlist?.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
              {wishlist.length}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link 
          to="/cart" 
          className="relative hover:text-gray-300 transition"
        >
          <FaShoppingCart size={18} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
              {cart.length}
            </span>
          )}
        </Link>

        {/* Profile */}
        <Link 
          to="/profile"
          className="hover:text-gray-300 transition"
        >
          <FaUser size={18} />
        </Link>

        {/* Logout */}
        <button
          onClick={logout}
          className="px-4 py-1.5 text-red-500 border border-red-700 rounded-md hover:bg-red-700 hover:text-white transition"
        >
          Logout
        </button>

      </div>
    ) : (
      <div className="flex gap-6 items-center text-sm font-medium">

        <Link 
          to="/products" 
          className="hover:text-gray-300 transition"
        >
          Products
        </Link>

        <Link
          to="/login"
          className="px-4 py-1.5 border border-gray-700 rounded-md hover:bg-white hover:text-black transition"
        >
          Login
        </Link>

      </div>
    )}

  </div>
</nav>
)
}

export default Navbar
