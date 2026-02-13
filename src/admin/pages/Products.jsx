import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../../services/API"
import DeleteModal from "../components/DeleteModal"
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline"

const PRODUCTS_PER_PAGE = 6

const ProductsAdmin = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    API.get("/products")
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-center mt-10">Loading products...</p>
  }

  /* ===================== PAGINATION ===================== */
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE)

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const currentProducts = products.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  )

  /* ===================== STOCK COUNT ===================== */
  const getTotalQty = product =>
    product.weights?.reduce((sum, w) => sum + (w.stock || 0), 0) || 0

  /* ===================== DELETE FUNCTION ===================== */
  const handleDelete = async () => {
    if (!selectedProduct) return

    await API.delete(`/products/${selectedProduct.id}`)

    setProducts(prev =>
      prev.filter(p => p.id !== selectedProduct.id)
    )

    setShowModal(false)
    setSelectedProduct(null)
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>

        <Link
          to="/admin/products/add"
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          + Add Product
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3">Starting Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentProducts.map(product => {
              const totalQty = getTotalQty(product)

              return (
                <tr key={product.id} className="border-t">

                  <td className="p-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-14 h-14 mx-auto rounded object-cover border"
                    />
                  </td>

                  <td className="p-3 font-medium">
                    {product.title}
                  </td>

                  <td className="p-3">
                    ₹{product.weights?.[0]?.price || "—"}
                  </td>

                  <td className="p-3">
                    {totalQty > 0 ? (
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-semibold">
                        In Stock ({totalQty})
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                        Out of Stock (0)
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-3">

                      {/* VIEW */}
                      <Link
                        to={`/admin/products/view/${product.id}`}
                        className="p-2 rounded border hover:bg-gray-100"
                      >
                        <EyeIcon className="w-5 h-5 text-gray-700" />
                      </Link>

                      {/* DELETE */}
                      <button
                        onClick={() => {
                          setSelectedProduct(product)
                          setShowModal(true)
                        }}
                        className="p-2 rounded border border-red-500 hover:bg-red-500 group"
                      >
                        <TrashIcon className="w-5 h-5 text-red-500 group-hover:text-white" />
                      </button>

                    </div>
                  </td>

                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ===================== PAGINATION CONTROLS ===================== */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded ${
                page === currentPage
                  ? "bg-black text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>
      )}

      {/* ===================== DELETE MODAL ===================== */}
      <DeleteModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title={`Delete ${selectedProduct?.title}?`}
      />

    </div>
  )
}

export default ProductsAdmin
