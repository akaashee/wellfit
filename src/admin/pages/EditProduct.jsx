import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import API from "../../services/API"

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [image, setImage] = useState("")
  const [description, setDescription] = useState("")
  const [weights, setWeights] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get(`/products/${id}`).then(res => {
      const p = res.data
      setTitle(p.title)
      setImage(p.image)
      setDescription(p.description)
      setWeights(p.weights || [])
      setLoading(false)
    })
  }, [id])

  const updateWeight = (index, field, value) => {
    const updated = [...weights]
    updated[index][field] = value
    setWeights(updated)
  }

  const addWeight = () => {
    setWeights([...weights, { weight: "", price: "" }])
  }

  const removeWeight = (index) => {
    setWeights(weights.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await API.put(`/products/${id}`, {
      title,
      image,
      description,
      weights
    })

    navigate("/admin/products")
  }

  if (loading) {
    return <p className="text-center mt-10">Loading product...</p>
  }

return (
  <div className="max-w-3xl mx-auto text-black">

    <div className="bg-white rounded-2xl shadow-md p-10">

      <h1 className="text-2xl font-semibold text-black mb-8">
        Edit Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* TITLE */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Product Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:border-black transition"
            placeholder="Product Title"
            required
          />
        </div>

        {/* IMAGE */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Product Image URL
          </label>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:border-black transition"
            placeholder="Image URL"
            required
          />

          {image && (
            <div className="mt-4">
              <img
                src={image}
                alt="Preview"
                className="w-32 h-32 object-cover border border-gray-200 rounded-lg"
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:border-black transition"
            rows={4}
          />
        </div>

        {/* WEIGHTS */}
        <div>
          <label className="block mb-3 text-sm font-medium text-gray-600">
            Weights & Prices
          </label>

          <div className="space-y-3">
            {weights.map((w, index) => (
              <div
                key={index}
                className="flex gap-3 items-center"
              >
                <input
                  value={w.weight}
                  onChange={(e) =>
                    updateWeight(index, "weight", e.target.value)
                  }
                  className="border border-gray-300 px-4 py-3 rounded-md w-1/2 focus:outline-none focus:border-black transition"
                  placeholder="Weight"
                />

                <input
                  type="number"
                  value={w.price}
                  onChange={(e) =>
                    updateWeight(index, "price", e.target.value)
                  }
                  className="border border-gray-300 px-4 py-3 rounded-md w-1/2 focus:outline-none focus:border-black transition"
                  placeholder="Price"
                />

                <button
                  type="button"
                  onClick={() => removeWeight(index)}
                  className="px-3 py-2 text-black rounded-md border border-gray-300 hover:bg-black hover:text-white transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addWeight}
            className="mt-4 text-sm font-medium text-black hover:underline"
          >
            + Add weight
          </button>
        </div>

        {/* SUBMIT */}
        <div className="pt-6">
          <button className="bg-black text-white px-8 py-3 rounded-md font-medium hover:opacity-85 transition">
            Update Product
          </button>
        </div>

      </form>
    </div>

  </div>
)

}

export default EditProduct
