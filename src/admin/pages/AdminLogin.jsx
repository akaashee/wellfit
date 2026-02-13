import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const AdminLogin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const {login} = useAuth()

  const handleLogin = (e) => {
    e.preventDefault()
    

    if (email === "jhon@gmail.com" && password === "123456") {
      // localStorage.setItem(
      //   "user",
      //   JSON.stringify({ name: "Admin", role: "admin" })
      // )
      login(email, password)
      navigate("/admin", { replace: true })
    } else {
      alert("Invalid admin credentials")
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 w-96 shadow rounded"
      >
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 mb-4"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white py-2">
          Login
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
