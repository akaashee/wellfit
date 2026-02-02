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
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white border p-6 w-96 rounded"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Sign Up
        </h2>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="border p-2 mb-3 w-full"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border p-2 mb-3 w-full"
        />

        <input
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          className="border p-2 mb-3 w-full"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="border p-2 mb-3 w-full"
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="border p-2 mb-4 w-full"
        />

        <button className="bg-black text-white w-full py-2 rounded hover:opacity-90">
          Sign Up
        </button>

        {/* LOGIN LINK */}
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Signup
