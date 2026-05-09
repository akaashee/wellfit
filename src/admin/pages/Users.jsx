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
  <div className="space-y-8">

    {/* HEADER */}
    <div>
      <h1 className="text-2xl font-semibold text-white">
        Users
      </h1>
      <p className="text-gray-400 mt-1 text-sm">
        Manage registered users
      </p>
    </div>

    {/* CARD */}
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">

      {/* SEARCH */}
      <div className="p-6 border-b border-gray-200">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none text-black focus:border-black transition"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4 text-center">Role</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map(user => (
              <tr
                key={user.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                {/* USER */}
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-black">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-black">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* ROLE */}
                <td className="p-4 text-center">
                  <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-black font-medium">
                    {user.role}
                  </span>
                </td>

                {/* STATUS */}
                <td className="p-4 text-center">
                  <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-black font-medium">
                    {user.status || "Active"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-4">

                    {/* BLOCK */}
                    <button
                      onClick={() => openBlockModal(user)}
                      className="p-2 rounded-md text-black border border-gray-200 hover:bg-black hover:text-white transition"
                    >
                      <EnvelopeIcon className="w-5 h-5" />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => openDeleteModal(user)}
                      className="p-2 rounded-md text-black border border-gray-200 hover:bg-black hover:text-white transition"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>

                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">
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
