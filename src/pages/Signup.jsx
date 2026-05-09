import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/API"

const Signup = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })

  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { name, email, phone, password, confirmPassword } = form

    // EMPTY FIELD VALIDATION
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("All fields are required")
      return
    }

    // PHONE VALIDATION (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      setError("Phone number must be 10 digits")
      return
    }

    // PASSWORD LENGTH
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    // PASSWORD MATCH
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // CHECK EXISTING USER
    const res = await API.get(`/users?email=${email}`)
    if (res.data.length > 0) {
      setError("User already exists. Please login.")
      return
    }

    // SAVE USER TO DB
    await API.post("/users", {
      name,
      email,
      phone,
      password
    })

    alert("Signup successful! Please login.")
    navigate("/login")
  }

  return (
  <div className="min-h-screen bg-black flex justify-center items-center px-6">

    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10"
    >
      <h2 className="text-3xl font-semibold text-black text-center mb-8 tracking-wide">
        CREATE ACCOUNT
      </h2>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 text-sm text-center text-black bg-gray-100 border border-gray-200 py-2 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-black focus:outline-none focus:border-black transition"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-black focus:outline-none focus:border-black transition"
        />

        <input
          name="phone"
          placeholder="Phone Number"
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

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-black focus:outline-none focus:border-black transition"
        />
      </div>

      <button
        className="w-full mt-8 bg-black text-white py-3 rounded-md font-medium transition hover:opacity-85"
      >
        Sign Up
      </button>

      {/* LOGIN LINK */}
      <p className="text-sm text-center text-gray-600 mt-6">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-black font-semibold hover:underline"
        >
          Login
        </Link>
      </p>

    </form>

  </div>
)
}

export default Signup
