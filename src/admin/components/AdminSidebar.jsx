import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const AdminSidebar = () => {
  const navigate = useNavigate()
  const {logout} = useAuth()

  const handleLogout = () => {
    // Clear admin auth only
    localStorage.removeItem("adminAuth")
    logout()
    navigate("/admin/login", { replace: true })

  }

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded transition ${
      isActive
        ? "bg-gray-800 text-green-400"
        : "hover:bg-gray-800 text-white"
    }`

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-black text-white flex flex-col z-50">
      {/* LOGO */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-center text-green-500">
          WELLFIT ADMIN
        </h1>
      </div>

      {/* NAV */}
      <nav className="flex-1 p-4 space-y-2">
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

        {/* Optional: Only keep if route exists */}
        {/* <NavLink to="/admin/users" className={linkClass}>
          Users
        </NavLink> */}
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
