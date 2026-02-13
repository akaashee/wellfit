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
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="border px-4 py-1.5 rounded hover:bg-black hover:text-white transition"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* PROFILE INFO */}
      <div className="border rounded p-6 space-y-4 bg-gray-50">
        {/* NAME */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          ) : (
            <p className="font-medium">{user.name}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Email
          </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          ) : (
            <p className="font-medium">{user.email}</p>
          )}
        </div>

        {/* PHONE */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Phone
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          ) : (
            <p className="font-medium">
              {user.phone || "—"}
            </p>
          )}
        </div>

        {/* ACTION BUTTONS */}
        {isEditing && (
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSaveProfile}
              className="bg-black text-white px-5 py-2 rounded hover:opacity-90"
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
              className="border px-5 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* ORDERS */}
      <h2 className="text-2xl font-bold mt-10 mb-4">
        My Orders
      </h2>

      {orders.length === 0 && <p>No orders yet</p>}

      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                Order #{order.id}
              </p>
              <p className="text-sm text-gray-500">
                Status: {order.status}
              </p>
              <p className="text-sm">
                Total: ₹{order.total}
              </p>
            </div>

            <Link
              to={`/order/${order.id}`}
              className="text-green-600 hover:underline"
            >
              Track Order
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Profile
