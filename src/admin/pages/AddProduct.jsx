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
    <div className="max-w-2xl bg-white p-6 shadow rounded">
      <h1 className="text-xl font-bold mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TITLE */}
        <div>
          <label className="block mb-1 font-medium">
            Product Title
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Whey Protein 2kg"
          />
        </div>

        {/* IMAGE */}
        <div>
          <label className="block mb-1 font-medium">
            Product Image URL
          </label>
          <input
            required
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="https://image-url.com/product.jpg"
          />

          {/* IMAGE PREVIEW */}
          {image && (
            <img
              src={image}
              alt="Preview"
              className="mt-3 w-32 h-32 object-cover border rounded"
              onError={(e) => {
                e.target.style.display = "none"
              }}
            />
          )}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            rows={4}
            placeholder="Product description..."
          />
        </div>

        {/* WEIGHTS */}
        <div>
          <label className="block mb-2 font-medium">
            Weights & Prices
          </label>

          {weights.map((w, index) => (
            <div
              key={index}
              className="flex gap-3 items-center mb-2"
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
                className="border px-3 py-2 rounded w-1/2"
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
                className="border px-3 py-2 rounded w-1/2"
              />

              {weights.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWeight(index)}
                  className="text-red-600"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addWeight}
            className="mt-2 text-sm text-blue-600"
          >
            + Add another weight
          </button>
        </div>

        {/* SUBMIT */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProduct
