import { useEffect, useState } from "react"

const images = [
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1600&q=80"
]

const HeroSlider = () => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 3000) // change image every 3 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt="Fitness Banner"
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Text Content */}
      <div className="absolute inset-63 flex flex-col justify-center items-center text-center text-white px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Train Hard. <span className="text-green-400 flex-1 justify-center  items-center">Stay Strong.</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl">
          Premium supplements crafted to elevate your fitness journey
        </p>
      </div>
    </div>
  )
}

export default HeroSlider
