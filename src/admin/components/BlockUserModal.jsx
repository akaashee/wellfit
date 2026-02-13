const BlockUserModal = ({ open, onClose, onConfirm }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md px-8 py-6 text-center">
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full border-4 border-red-100 flex items-center justify-center">
            <span className="text-red-600 text-xl font-bold">!</span>
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-xl font-bold mb-2">
          Block User
        </h2>

        {/* MESSAGE */}
        <p className="text-gray-500 mb-6">
          Are you sure you want to Block this user?
        </p>

        {/* ACTIONS */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 transition"
          >
            No
          </button>

          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Yes, Block User
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlockUserModal
