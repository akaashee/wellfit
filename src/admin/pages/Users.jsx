import { useEffect, useState } from "react"
import API from "../../services/API"
import {
  EnvelopeIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline"
import BlockUserModal from "../components/BlockUserModal"
import DeleteUserModal from "../components/DeleteUserModal"

const Users = () => {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const [selectedUser, setSelectedUser] = useState(null)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    API.get("/users")
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false))
  }, [])

  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  /* ===== BLOCK USER ===== */
  const openBlockModal = (user) => {
    setSelectedUser(user)
    setShowBlockModal(true)
  }

  const confirmBlockUser = async () => {
    if (!selectedUser) return

    // API placeholder
    // await API.patch(`/users/${selectedUser.id}/block`)

    setUsers(prev =>
      prev.map(u =>
        u.id === selectedUser.id
          ? { ...u, status: "Blocked" }
          : u
      )
    )

    setShowBlockModal(false)
    setSelectedUser(null)
  }

  /* ===== DELETE USER ===== */
  const openDeleteModal = (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const confirmDeleteUser = async () => {
    if (!selectedUser) return

    // API placeholder
    // await API.delete(`/users/${selectedUser.id}`)

    setUsers(prev =>
      prev.filter(u => u.id !== selectedUser.id)
    )

    setShowDeleteModal(false)
    setSelectedUser(null)
  }

  if (loading) {
    return <p className="text-center mt-10">Loading users...</p>
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-gray-500 mt-1">
          Manage registered users
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow">
        {/* SEARCH */}
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-500">
              <tr>
                <th className="p-4 text-left">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  {/* USER */}
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ROLE */}
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      user.status === "Blocked"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {user.status || "Active"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-4">
                      {/* BLOCK */}
                      <button
                        onClick={() => openBlockModal(user)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <EnvelopeIcon className="w-5 h-5" />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      <BlockUserModal
        open={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        onConfirm={confirmBlockUser}
      />

      <DeleteUserModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteUser}
      />
    </div>
  )
}

export default Users
