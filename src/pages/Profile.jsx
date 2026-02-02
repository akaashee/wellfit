import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../services/API"

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  const [orders, setOrders] = useState([])

  useEffect(() => {
    API.get(`/orders?userId=${user.id}`).then(res =>
      setOrders(res.data)
    )
  }, [user.id])

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <h2 className="text-2xl font-bold mt-8 mb-4">
        My Orders
      </h2>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map(order => (
        <div key={order.id} className="border p-4 mb-3">
          <p>Order #{order.id}</p>
          <p>Status: {order.status}</p>
          <p>Total: ₹{order.total}</p>

          <Link
            to={`/order/${order.id}`}
            className="text-green-600"
          >
            Track Order
          </Link>
        </div>
      ))}
    </div>
  )
}

export default Profile
