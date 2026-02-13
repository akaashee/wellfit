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
    <div className="max-w-2xl bg-white p-6 shadow rounded">
      <h1 className="text-xl font-bold mb-6">
        Edit Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TITLE */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Product Title"
          required
        />

        {/* IMAGE */}
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Image URL"
          required
        />

        {image && (
          <img
            src={image}
            alt="Preview"
            className="w-32 h-32 object-cover border rounded"
          />
        )}

        {/* DESCRIPTION */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          rows={4}
        />

        {/* WEIGHTS */}
        {weights.map((w, index) => (
          <div key={index} className="flex gap-3 items-center">
            <input
              value={w.weight}
              onChange={(e) =>
                updateWeight(index, "weight", e.target.value)
              }
              className="border px-3 py-2 rounded w-1/2"
              placeholder="Weight"
            />

            <input
              type="number"
              value={w.price}
              onChange={(e) =>
                updateWeight(index, "price", e.target.value)
              }
              className="border px-3 py-2 rounded w-1/2"
              placeholder="Price"
            />

            <button
              type="button"
              onClick={() => removeWeight(index)}
              className="text-red-600"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addWeight}
          className="text-blue-600 text-sm"
        >
          + Add weight
        </button>

        {/* SUBMIT */}
        <button className="bg-black text-white px-6 py-2 rounded">
          Update Product
        </button>
      </form>
    </div>
  )
}

export default EditProduct
