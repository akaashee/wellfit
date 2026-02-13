import React from "react"

const DeleteModal = ({
  open,
  onClose,
  onConfirm,
  title = "Delete Product?"
}) => {

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center space-y-4">

        <h2 className="text-xl font-semibold">
          {title}
        </h2>

        <p className="text-gray-600">
          Are you sure you want to delete this item?
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Yes, Delete
          </button>
        </div>

      </div>

    </div>
  )
}

export default DeleteModal
