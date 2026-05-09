import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const AdminSidebar = () => {
  const navigate = useNavigate()
  const {logout} = useAuth()

  const handleLogout = () => {
    // Clear admin auth only
    localStorage.removeItem("adminAuth")
    logout()
    navigate("/login", { replace: true })

  }

  const linkClass = ({ isActive }) =>
  `block px-4 py-2.5 rounded-md text-sm font-medium transition ${
    isActive
      ? "bg-white text-black"
      : "text-gray-400 hover:bg-white/10 hover:text-white"
  }`

return (
  <aside className="fixed top-0 left-0 w-64 h-screen bg-black border-r border-gray-800 flex flex-col z-50">

    {/* LOGO */}
    <div className=" p-6 border-b border-gray-800">
      <h1 className="hover:text-green-500 text-2xl font-semibold tracking-widest text-center">
        WELLFIT
      </h1>
      <p className="text-xs text-gray-500 text-center mt-1">
        ADMIN PANEL
      </p>
    </div>

    {/* NAV */}
    <nav className="flex-1 px-4 py-6 space-y-2">

      <NavLink to="/admin" end className={linkClass}>
        Dashboard
      </NavLink>

      <NavLink to="/admin/sales-analytics" className={linkClass}>
        Sales Analytics
      </NavLink>

      <NavLink to="/admin/products" className={linkClass}>
        Products
      </NavLink>

      <NavLink to="/admin/users" className={linkClass}>
        Users
      </NavLink>

      <NavLink to="/admin/orders" className={linkClass}>
        Orders
      </NavLink>

    </nav>

    {/* LOGOUT */}
    <div className="p-6 border-t border-gray-800">
      <button
        onClick={handleLogout}
        className="w-full px-4 py-2.5 border border-red-700 text-red-500 rounded-md hover:bg-red-700 hover:text-white transition"
      >
        Logout
      </button>
    </div>

  </aside>
)
}
export default AdminSidebar
