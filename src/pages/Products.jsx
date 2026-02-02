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
    <div className="min-h-screen py-14">
      <div className="max-w-7xl mx-auto px-8">

        <h1 className="text-4xl font-extrabold text-center mb-6">
          Products
        </h1>

        {/* SEARCH INFO */}
        {search && (
          <p className="text-center mb-4 text-gray-500">
            Showing results for "<strong>{search}</strong>"
          </p>
        )}

        {/* FILTER BAR */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

          {/* CATEGORY */}
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="All">All Categories</option>
            <option value="Protein">Protein</option>
            <option value="Performance">Performance</option>
            <option value="Vitamins & Health">Vitamins & Health</option>
            <option value="Nutrition">Nutrition</option>
            <option value="Hydration">Hydration</option>
          </select>

          {/* SORT */}
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="">Sort by Price</option>
            <option value="low-high">Price: Low → High</option>
            <option value="high-low">Price: High → Low</option>
          </select>
        </div>

        {/* PRODUCTS GRID */}
        {paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-14">
              {paginatedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-14">

                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage(prev => prev - 1)
                  }
                  className={`px-4 py-2 border rounded ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-black hover:text-white"
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
                      className={`px-4 py-2 border rounded ${
                        currentPage === page
                          ? "bg-black text-white"
                          : "hover:bg-black hover:text-white"
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage(prev => prev + 1)
                  }
                  className={`px-4 py-2 border rounded ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-black hover:text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center mt-20 text-gray-500">
            <p className="text-xl font-semibold">
              No products found 
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Products
