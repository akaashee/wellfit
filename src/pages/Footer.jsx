import { Link, useLocation } from "react-router-dom"

const Footer = () => {
  const location = useLocation()

  //  Scroll to top of current page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-7xl mx-auto px-8 py-14">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/*  LEFT - BRAND */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Wellfit
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed">
              Wellfit is your trusted destination for premium
              gym supplements and fitness nutrition. We are
              committed to delivering quality products that
              support strength, performance, and a healthier
              lifestyle.
            </p>
          </div>

          {/*  CENTER - SHOP */}
          <div className="md:text-center">
            <h2 className="text-xl font-semibold mb-4">
              Shop
            </h2>

            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/Profile"
                  className="hover:text-white"
                >
                  Order Details
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="hover:text-white"
                >
                  Cart
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className="hover:text-white"
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/*  RIGHT - SUPPORT */}
          <div className="md:text-right">
            <h2 className="text-xl font-semibold mb-4">
              Support
            </h2>

            <ul className="space-y-2 text-gray-400">
              <li>
                <button
                  onClick={scrollToTop}
                  className="hover:text-white"
                >
                  Contact Us
                </button>
              </li>

              <li>
                <button
                  onClick={scrollToTop}
                  className="hover:text-white"
                >
                  Returns
                </button>
              </li>

              <li>
                <button
                  onClick={scrollToTop}
                  className="hover:text-white"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/*  BOTTOM */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Wellfit. All rights reserved.
        </div>

      </div>
    </footer>
  )
}

export default Footer
