import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import API from "../../services/API"
import DeleteModal from "../components/DeleteModal"
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"

const ProductView = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)

  // For editing stock
  const [editingIndex, setEditingIndex] = useState(null)
  const [newStock, setNewStock] = useState(0)

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .finally(() => setLoading(false))
  }, [id])

  const deleteProduct = async () => {
    await API.delete(`/products/${id}`)
    navigate("/admin/products")
  }

  const handleSaveStock = async (index) => {
    const updatedWeights = [...product.weights]
    updatedWeights[index].stock = Number(newStock)

    await API.put(`/products/${id}`, {
      ...product,
      weights: updatedWeights,
    })

    setProduct(prev => ({
      ...prev,
      weights: updatedWeights,
    }))

    setEditingIndex(null)
  }

  if (loading) {
    return <p className="text-center mt-10">Loading product...</p>
  }

  if (!product) {
    return <p className="text-center mt-10">Product not found</p>
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-black"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back
      </button>

      {/* MAIN CARD */}
      <div className="bg-white shadow-lg rounded-xl p-8 space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold">
            {product.title}
          </h1>

          <div className="flex gap-3">
            <Link
              to={`/admin/products/edit/${product.id}`}
              className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-black hover:text-white transition"
            >
              <PencilSquareIcon className="w-5 h-5" />
              Edit
            </Link>

            <button
              onClick={() => setShowDelete(true)}
              className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
            >
              <TrashIcon className="w-5 h-5" />
              Delete
            </button>
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={product.image}
            alt={product.title}
            className="w-64 h-64 object-cover rounded-xl border shadow"
          />

          <div className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            <div className="text-lg font-semibold">
              Starting Price: ₹
              {product.weights?.[0]?.price || "—"}
            </div>
          </div>
        </div>

        {/* VARIANTS TABLE */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Edit Stock by Variant
          </h3>

          <div className="overflow-hidden border rounded-lg">
            <table className="w-full text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 border">Weight</th>
                  <th className="p-4 border">Price</th>
                  <th className="p-4 border">Stock</th>
                  <th className="p-4 border">Action</th>
                </tr>
              </thead>

              <tbody>
                {product.weights?.map((w, index) => (
                  <tr key={index} className="border-t">

                    <td className="p-4 border">
                      {w.weight}
                    </td>

                    <td className="p-4 border">
                      ₹{w.price}
                    </td>

                    <td className="p-4 border">
                      {editingIndex === index ? (
                        <input
                          type="number"
                          min="0"
                          value={newStock}
                          onChange={(e) =>
                            setNewStock(e.target.value)
                          }
                          className="w-24 border rounded px-2 py-1 text-center"
                        />
                      ) : (
                        <span className="font-semibold">
                          {w.stock}
                        </span>
                      )}
                    </td>

                    <td className="p-4 border">
                      {editingIndex === index ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              handleSaveStock(index)
                            }
                            className="px-3 py-1 bg-green-600 text-white rounded"
                          >
                            Save
                          </button>

                          <button
                            onClick={() =>
                              setEditingIndex(null)
                            }
                            className="px-3 py-1 border rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingIndex(index)
                            setNewStock(w.stock)
                          }}
                          className="px-3 py-1 border rounded hover:bg-gray-100"
                        >
                          Edit Stock
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      <DeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={deleteProduct}
      />
    </div>
  )
}

export default ProductView
