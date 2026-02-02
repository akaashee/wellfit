import { useContext } from "react"
import { StoreContext } from "../context/StoreContext"

const Toast = () => {
  const { toastMessage } = useContext(StoreContext)

  if (!toastMessage) return null

  //  Detect toast type
  const isRemove =
    toastMessage.toLowerCase().includes("removed") ||
    toastMessage.toLowerCase().includes("remove")

  return (
    <div
      className={`
        fixed
        top-6
        right-6
        px-5
        py-4
        rounded-lg
        shadow-xl
        z-50
        flex
        items-center
        gap-3
        animate-slideIn
        mt-11
        ${isRemove ? "bg-gray-800" : "bg-black"}
      `}
    >
      {/* ICON */}
      <div
        className={`
          rounded-full
          w-6
          h-6
          flex
          items-center
          justify-center
          font-bold
          text-sm
          ${isRemove
            ? "bg-blue-500 text-white"
            : "bg-white text-black"}
        `}
      >
        {isRemove ? "ℹ" : "✓"}
      </div>

      {/* MESSAGE */}
      <span className="text-sm font-medium text-white">
        {toastMessage}
      </span>
    </div>
  )
}

export default Toast
