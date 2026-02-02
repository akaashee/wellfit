import { useEffect, useState } from "react"
import API from "../services/API"
import HeroSlider from "../components/HeroSolider"
import ProductCard from "../components/ProductCard"

const Home = () => {
  const [products, setProducts] = useState([])
  

  useEffect(() => {
    API.get("/products").then(res => {
      setProducts(res.data.slice(0, 4)) // Featured products
    })
  }, [])

  return (
    <>
      {/* HERO */}
      <HeroSlider />

      {/* FEATURED PRODUCTS */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-full mx-auto px-6">

          <h2 className="text-4xl font-extrabold text-center mb-12">
            Featured Products
          </h2>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-8
            "
          >
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
