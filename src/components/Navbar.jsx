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
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between text-white">

        <Link to="/" className="text-2xl font-bold text-green-400">
          WELLFIT
        </Link>

        {isAuth && (
          <div className="hidden md:flex items-center bg-white rounded px-3">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              value={search}
              onChange={handleSearch}
              placeholder="Search products..."
              className="py-1.5 w-56 text-black outline-none"
            />
          </div>
        )}

        {isAuth ? (
          <div className="flex items-center gap-6">
            <Link to="/products" className="flex items-end">Products</Link>


            <Link to="/wishlist" className="relative">
              <FaHeart size={20} />
              {wishlist?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative">
              <FaShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-xs px-1.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>

            <Link to="/profile">
              <FaUser size={20} />
            </Link>

            <button
              onClick={logout}
              className=" px-4 py-1.5 rounded hover:bg-white hover:text-red-500"
            >
              Logout
            </button>

          </div>
        ) : (
          <div className="flex gap-3 items-center">
            <Link to="/products" className="flex items-end">Products</Link>
            <Link
            to="/login"
            className="hover:text-green-500 hover:bg-white px-4 py-1.5 rounded"
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
