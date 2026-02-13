import { Navigate, useNavigate } from "react-router-dom"
import { AuthContext, useAuth } from "../../context/AuthContext"

const AdminRoute = ({ children }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  if (!user || user.role !== "admin") {
    return navigate("/admin/login")
  }

  return children
}

export default AdminRoute
