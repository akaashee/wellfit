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
  <div className="max-w-6xl mx-auto space-y-8">

    {/* BACK BUTTON */}
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
    >
      <ArrowLeftIcon className="w-5 h-5" />
      Back
    </button>

    {/* MAIN CARD */}
    <div className="bg-white rounded-2xl shadow-md p-10 space-y-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
        <h1 className="text-2xl font-semibold text-black">
          {product.title}
        </h1>

        <div className="flex gap-3">

          <Link
            to={`/admin/products/edit/${product.id}`}
            className="text-black flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-md hover:bg-black hover:text-white transition text-sm font-medium"
          >
            <PencilSquareIcon className="w-5 h-5 " />
            Edit
          </Link>

          <button
            onClick={() => setShowDelete(true)}
            className="text-black flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-md hover:bg-black hover:text-white transition text-sm font-medium"
          >
            <TrashIcon className="w-5 h-5" />
            Delete
          </button>

        </div>
      </div>

      {/* PRODUCT INFO */}
      <div className="flex flex-col md:flex-row gap-10">

        <img
          src={product.image}
          alt={product.title}
          className="w-64 h-64 object-cover rounded-xl border border-gray-200"
        />

        <div className="space-y-6 max-w-xl">

          <p className="text-gray-600 leading-relaxed text-sm">
            {product.description}
          </p>

          <div className="text-lg font-semibold text-black">
            Starting Price: ₹{product.weights?.[0]?.price || "—"}
          </div>

        </div>
      </div>

      {/* VARIANTS TABLE */}
      <div>
        <h3 className="text-lg font-semibold text-black mb-6">
          Manage Stock by Variant
        </h3>

        <div className="overflow-hidden border border-gray-200 rounded-xl">
          <table className="w-full text-sm">

            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-xs">
              <tr>
                <th className="p-4 text-left">Weight</th>
                <th className="p-4 text-center">Price</th>
                <th className="p-4 text-center">Stock</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {product.weights?.map((w, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 last:border-0"
                >

                  <td className="p-4 font-medium text-black">
                    {w.weight}
                  </td>

                  <td className="p-4 text-center text-gray-600">
                    ₹{w.price}
                  </td>

                  <td className="p-4 text-center">
                    {editingIndex === index ? (
                      <input
                        type="number"
                        min="0"
                        value={newStock}
                        onChange={(e) =>
                          setNewStock(e.target.value)
                        }
                        className="w-24 border border-gray-300 rounded-md px-3 py-1.5 text-center focus:outline-none text-black focus:border-black transition"
                      />
                    ) : (
                      <span className="font-semibold text-black">
                        {w.stock}
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    {editingIndex === index ? (
                      <div className="flex justify-end gap-3">

                        <button
                          onClick={() => handleSaveStock(index)}
                          className="px-4 py-1.5 bg-black text-white rounded-md text-xs font-medium hover:opacity-85 transition"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => setEditingIndex(null)}
                          className="text-black px-4 py-1.5 border border-gray-300 rounded-md text-xs font-medium hover:bg-black hover:text-white transition"
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
                        className="text-black px-4 py-1.5 border border-gray-300 rounded-md text-xs font-medium hover:bg-black hover:text-white transition"
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
