import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Login = () => {
  const navigate = useNavigate()
  const { login, user } = useAuth()
  

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const { email, password } = form
    const res = await login(email, password)

    if (!res) {
      alert("Invalid email or password")
      return
    }

    navigate("/")
  }


  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white border p-6 w-96 rounded"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Login
        </h2>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border p-2 mb-3 w-full"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="border p-2 mb-4 w-full"
        />

        <button type="submit" className="bg-black text-white w-full py-2 rounded">
          Login
        </button>

        {/*  SIGNUP LINK */}
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-green-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
