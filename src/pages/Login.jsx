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
  <div className="min-h-screen bg-black flex justify-center items-center px-6">

    <form
      onSubmit={handleLogin}
      className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10"
    >
      <h2 className="text-3xl font-semibold text-black text-center mb-8 tracking-wide">
        LOGIN
      </h2>

      <div className="space-y-4">
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-black focus:outline-none focus:border-black transition"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-black focus:outline-none focus:border-black transition"
        />
      </div>

      <button
        type="submit"
        className="w-full mt-8 bg-black text-white py-3 rounded-md font-medium transition hover:opacity-85"
      >
        Login
      </button>

      {/* SIGNUP LINK */}
      <p className="text-sm text-center text-gray-600 mt-6">
        Don’t have an account?{" "}
        <Link
          to="/signup"
          className="text-black font-semibold hover:underline"
        >
          Sign Up
        </Link>
      </p>

    </form>

  </div>
)
}

export default Login
