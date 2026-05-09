import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuth")
    const storedUser = localStorage.getItem("user")

    if (storedAuth === "true" && storedUser) {
      setIsAuth(true)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email, password) => {
    const res = await axios.get(
      `http://localhost:3001/users?email=${email}&password=${password}`
    )

    if (res.data.length > 0) {
      setIsAuth(true)
      setUser(res.data[0])
      localStorage.setItem("isAuth", "true")
      localStorage.setItem("user", JSON.stringify(res.data[0]))
      if(res.data[0].role === "admin")  navigate("/admin", { replace: true })
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuth(false)
    setUser(null)
    localStorage.removeItem("isAuth")
    localStorage.removeItem("user")
  }


  return (
    <AuthContext.Provider value={{ isAuth, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
