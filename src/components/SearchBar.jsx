import { FiSearch } from "react-icons/fi"

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative">
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type a product name, e.g. Whey Protein"
        className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
    </div>
  )
}

export default SearchBar
