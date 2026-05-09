import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../../services/API"

const AddProduct = () => {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [image, setImage] = useState("")
  const [description, setDescription] = useState("")
  const [weights, setWeights] = useState([
    { weight: "", price: "" }
  ])

  // ADD NEW WEIGHT ROW
  const addWeight = () => {
    setWeights([...weights, { weight: "", price: "" }])
  }

  // REMOVE WEIGHT ROW
  const removeWeight = (index) => {
    setWeights(weights.filter((_, i) => i !== index))
  }

  // HANDLE WEIGHT CHANGE
  const handleWeightChange = (index, field, value) => {
    const updated = [...weights]
    updated[index][field] = value
    setWeights(updated)
  }

  // SUBMIT PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault()

    const newProduct = {
      title,
      image,
      description,
      weights: weights.filter(
        w => w.weight && w.price
      )
    }

    await API.post("/products", newProduct)
    navigate("/admin/products")
  }

  return (
  <div className="max-w-3xl mx-auto">

    <div className="bg-white rounded-2xl shadow-md p-10">

      <h1 className="text-2xl font-semibold text-black mb-8">
        Add Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* TITLE */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Product Title
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border text-black border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:border-black transition"
            placeholder="Whey Protein 2kg"
          />
        </div>

        {/* IMAGE */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Product Image URL
          </label>
          <input
            required
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border text-black border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:border-black transition"
            placeholder="https://image-url.com/product.jpg"
          />

          {image && (
            <div className="mt-4">
              <img
                src={image}
                alt="Preview"
                className="w-32 text-black h-32 object-cover border border-gray-200 rounded-lg"
                onError={(e) => {
                  e.target.style.display = "none"
                }}
              />
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Description
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-black border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:border-black transition"
            rows={4}
            placeholder="Product description..."
          />
        </div>

        {/* WEIGHTS */}
        <div>
          <label className="block mb-3 text-sm font-medium text-black">
            Weights & Prices
          </label>

          <div className="space-y-3">
            {weights.map((w, index) => (
              <div
                key={index}
                className="flex gap-3 items-center"
              >
                <input
                  required
                  placeholder="Weight (e.g. 1kg)"
                  value={w.weight}
                  onChange={(e) =>
                    handleWeightChange(
                      index,
                      "weight",
                      e.target.value
                    )
                  }
                  className="border border-gray-300 px-4 py-3 rounded-md w-1/2 focus:outline-none text-black focus:border-black transition"
                />

                <input
                  required
                  type="number"
                  placeholder="Price"
                  value={w.price}
                  onChange={(e) =>
                    handleWeightChange(
                      index,
                      "price",
                      e.target.value
                    )
                  }
                  className="border border-gray-300 px-4 py-3 rounded-md w-1/2 focus:outline-none text-black focus:border-black transition"
                />

                {weights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWeight(index)}
                    className="px-3 py-2 rounded-md border border-gray-300 hover:bg-black hover:text-white transition"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addWeight}
            className="mt-4 text-sm font-medium text-black hover:underline"
          >
            + Add another weight
          </button>
        </div>

        {/* SUBMIT */}
        <div className="pt-6">
          <button
            type="submit"
            className="bg-black text-white px-8 py-3 rounded-md font-medium hover:opacity-85 transition"
          >
            Add Product
          </button>
        </div>

      </form>
    </div>

  </div>
)
}

export default AddProduct
