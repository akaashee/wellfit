import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../services/API"

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"))

  const [user, setUser] = useState(storedUser)
  const [orders, setOrders] = useState([])

  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
    phone: storedUser.phone || "",
  })

  /* =====================
      FETCH ORDERS
  ====================== */
  useEffect(() => {
    API.get(`/orders?userId=${user.id}`).then(res =>
      setOrders(res.data)
    )
  }, [user.id])

  /* =====================
      INPUT CHANGE
  ====================== */
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  /* =====================
      SAVE PROFILE
  ====================== */
  const handleSaveProfile = async () => {
    try {
      const res = await API.patch(`/users/${user.id}`, form)

      // update state
      setUser(res.data)

      // update localStorage
      localStorage.setItem("user", JSON.stringify(res.data))

      setIsEditing(false)
    } catch (error) {
      console.error("Profile update failed", error)
      alert("Failed to update profile")
    }
  }

  return (
  <div className="min-h-screen bg-black py-24">
    <div className="max-w-5xl mx-auto px-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-semibold text-white tracking-wide">
          MY PROFILE
        </h1>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="border border-white text-white px-5 py-2 rounded-md hover:bg-white hover:text-black transition"
          >
            Edit Profile
          </button>
        )}
      </div>

      

      {/* PROFILE CARD */}
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">

        {/* NAME */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-black focus:outline-none focus:border-black transition"
            />
          ) : (
            <p className="font-medium text-black">{user.name}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Email
          </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-black focus:outline-none focus:border-black transition"
            />
          ) : (
            <p className="font-medium text-black">{user.email}</p>
          )}
        </div>

        {/* PHONE */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Phone
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-black focus:outline-none focus:border-black transition"
            />
          ) : (
            <p className="font-medium text-black">
              {user.phone || "—"}
            </p>
          )}
        </div>

        {/* ACTION BUTTONS */}
        {isEditing && (
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSaveProfile}
              className="bg-black text-white px-6 py-3 rounded-md hover:opacity-85 transition"
            >
              Save
            </button>

            <button
              onClick={() => {
                setIsEditing(false)
                setForm({
                  name: user.name,
                  email: user.email,
                  phone: user.phone || "",
                })
              }}
              className="border border-black text-black px-6 py-3 rounded-md hover:bg-black hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* ORDERS SECTION */}
      <h2 className="text-2xl font-semibold text-white mt-16 mb-6">
        MY ORDERS
      </h2>

      {orders.length === 0 && (
        <p className="text-gray-400">No orders yet</p>
      )}

      <div className="space-y-6">
        {orders.map(order => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-black">
                Order #{order.id}
              </p>

              <p className="text-sm text-gray-500">
                Status: {order.status}
              </p>

              <p className="text-sm text-black mt-1">
                Total: ₹{order.total}
              </p>
            </div>

            <Link
              to={`/order/${order.id}`}
              className="text-black font-medium hover:underline"
            >
              Track Order
            </Link>
          </div>
        ))}
      </div>

    </div>
  </div>
)
}

export default Profile
