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
  <div className="space-y-8">

    {/* HEADER */}
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-white">
        Products
      </h1>

      <Link
        to="/admin/products/add"
        className="px-5 py-2 bg-white text-black rounded-md font-medium hover:opacity-85 transition"
      >
        + Add Product
      </Link>
    </div>

    {/* TABLE */}
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-sm text-gray-600 uppercase tracking-wider">
              <th className="p-4">Image</th>
              <th className="p-4">Title</th>
              <th className="p-4">Starting Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentProducts.map(product => {
              const totalQty = getTotalQty(product)

              return (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                    />
                  </td>

                  <td className="p-4 font-medium text-black">
                    {product.title}
                  </td>

                  <td className="p-4 text-black">
                    ₹{product.weights?.[0]?.price || "—"}
                  </td>

                  <td className="p-4">
                    {totalQty > 0 ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-black font-medium">
                        In Stock ({totalQty})
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-600 font-medium">
                        Out of Stock (0)
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-3">

                      {/* VIEW */}
                      <Link
                        to={`/admin/products/view/${product.id}`}
                        className="p-2 text-black rounded-md border border-gray-200 hover:bg-black hover:text-white transition"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>

                      {/* DELETE */}
                      <button
                        onClick={() => {
                          setSelectedProduct(product)
                          setShowModal(true)
                        }}
                        className="p-2 rounded-mdm text-black border border-gray-200 hover:bg-black hover:text-white transition"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>

                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>

    {/* PAGINATION */}
    {totalPages > 1 && (
      <div className="flex justify-center items-center gap-3 mt-6">

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
          className="px-4 py-1.5 border border-gray-300 rounded-md text-white disabled:opacity-40 hover:bg-white hover:text-black transition"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-1.5 rounded-md border transition ${
              page === currentPage
                ? "bg-white text-black border-white"
                : "border-gray-400 text-white hover:bg-white hover:text-black"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
          className="px-4 py-1.5 border border-gray-300 rounded-md text-white disabled:opacity-40 hover:bg-white hover:text-black transition"
        >
          Next
        </button>

      </div>
    )}

    {/* DELETE MODAL */}
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
