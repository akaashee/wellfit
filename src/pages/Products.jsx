import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import API from "../services/API"
import ProductCard from "../components/ProductCard"

const PRODUCTS_PER_PAGE = 8

//  CATEGORY LOGIC
const getCategory = (title) => {
  const t = title.toLowerCase()

  if (
    t.includes("whey") ||
    t.includes("protein") ||
    t.includes("mass")
  ) return "Protein"

  if (
    t.includes("creatine") ||
    t.includes("bcaa") ||
    t.includes("pre workout") ||
    t.includes("glutamine")
  ) return "Performance"

  if (
    t.includes("vitamin") ||
    t.includes("fish oil") ||
    t.includes("zma") ||
    t.includes("ashwagandha")
  ) return "Vitamins & Health"

  if (
    t.includes("peanut") ||
    t.includes("bars")
  ) return "Nutrition"

  if (
    t.includes("electrolyte")
  ) return "Hydration"

  return "Other"
}

const Products = () => {
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState("")
  const [category, setCategory] = useState("All")

  const location = useLocation()

  //  SEARCH QUERY
  const searchParams = new URLSearchParams(location.search)
  const search = searchParams.get("search") || ""

  useEffect(() => {
    API.get("/products").then(res => {
      setProducts(res.data)
    })
  }, [])

  //  RESET PAGE
  useEffect(() => {
    setCurrentPage(1)
  }, [search, sortOrder, category])

  //  FILTER BY SEARCH
  const searchFiltered = products.filter(product =>
    product.title.toLowerCase().includes(search.toLowerCase())
  )

  //  FILTER BY CATEGORY
  const categoryFiltered =
    category === "All"
      ? searchFiltered
      : searchFiltered.filter(
          p => getCategory(p.title) === category
        )

  //  SORT BY PRICE
  const sortedProducts = [...categoryFiltered].sort((a, b) => {
    const priceA = a.weights?.[0]?.price || 0
    const priceB = b.weights?.[0]?.price || 0

    if (sortOrder === "low-high") return priceA - priceB
    if (sortOrder === "high-low") return priceB - priceA
    return 0
  })

  //  PAGINATION
  const totalPages = Math.ceil(
    sortedProducts.length / PRODUCTS_PER_PAGE
  )

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  )

return (
  <div className="min-h-screen bg-black text-white py-20">
    <div className="max-w-7xl mx-auto px-6">

      {/* TITLE */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-wide">
          PRODUCTS
        </h1>

        {search && (
          <p className="mt-4 text-gray-400 text-sm">
            Showing results for 
            <span className="text-white font-medium"> "{search}"</span>
          </p>
        )}
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-14">

        {/* CATEGORY */}
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="bg-black border border-gray-700 text-white px-5 py-2 rounded-md focus:outline-none focus:border-white transition"
        >
          <option value="All" className="text-white">All Categories</option>
          <option value="Protein" className="text-white">Protein</option>
          <option value="Performance" className="text-white">Performance</option>
          <option value="Vitamins & Health" className="text-white">Vitamins & Health</option>
          <option value="Nutrition" className="text-white">Nutrition</option>
          <option value="Hydration" className="text-white">Hydration</option>
        </select>

        {/* SORT */}
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          className="bg-black border border-gray-700 text-white px-5 py-2 rounded-md focus:outline-none focus:border-white transition">
          <option value="" className="text-white">Sort by Price</option>
          <option value="low-high" className="text-white">Price: Low → High</option>
          <option value="high-low" className="text-white">Price: High → Low</option>
        </select>
      </div>

      {/* PRODUCTS GRID */}
      {paginatedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
            {paginatedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-16">

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className={`px-4 py-2 border border-gray-700 rounded-md transition ${
                  currentPage === 1
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-white hover:text-black"
                }`}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border border-gray-700 rounded-md transition ${
                      currentPage === page
                        ? "bg-white text-black"
                        : "hover:bg-white hover:text-black"
                    }`}
                  >
                    {page}
                  </button>
                )
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className={`px-4 py-2 border border-gray-700 rounded-md transition ${
                  currentPage === totalPages
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-white hover:text-black"
                }`}
              >
                Next
              </button>

            </div>
          )}
        </>
      ) : (
        <div className="text-center mt-24 text-gray-500">
          <p className="text-lg">
            No products found
          </p>
        </div>
      )}

    </div>
  </div>
)
}

export default Products
