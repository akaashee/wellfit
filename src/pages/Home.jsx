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
    <section className="bg-black py-24 text-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-widest">
            FEATURED PRODUCTS
          </h2>
          <p className="mt-5 text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
            Carefully selected essentials designed to support your fitness journey.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14">
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
