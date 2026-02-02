import { useState } from "react"
import API from "../services/API"
import { useNavigate } from "react-router-dom"

const AddProduct = () => {
  const navigate = useNavigate()

  const [product, setProduct] = useState({
    title: "",
    price: "",
    image: "",
    description: ""
  })

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await API.post("/products", {
      ...product,
      price: Number(product.price)
    })

    alert("Product Added Successfully")
    navigate("/products")
  }

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="title"
          placeholder="Product Name"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Product Description"
          className="w-full border p-3 rounded h-28"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600"
        >
          Add Product
        </button>
      </form>
    </div>
  )
}

export default AddProduct
