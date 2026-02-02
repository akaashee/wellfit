import { Routes, Route, Navigate } from "react-router-dom"
import { useContext } from "react"

import Navbar from "./components/Navbar"
import Toast from "./components/Toast"
import { ToastContainer } from 'react-toastify';
import Home from "./pages/Home"
import Products from "./pages/Products"
import ProductDetails from "./pages/ProductDetails"
import Cart from "./pages/Cart"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Checkout from "./pages/Checkout"
import OrderSuccess from "./pages/OrderSuccess"
import Wishlist from "./pages/Whishlist"
import Profile from "./pages/Profile"
import OrderDetails from "./pages/OrderDetails"
import { StoreContext } from "./context/StoreContext"
import Footer from "./pages/Footer"

// PRIVATE ROUTE
const PrivateRoute = ({ children }) => {
  const isAuth = localStorage.getItem("isAuth")
  return isAuth ? children : <Navigate to="/login" />
}

function App() {
  const { toastMessage } = useContext(StoreContext)

  return (
    <>
      {/* TOAST */}
      <Toast />

      {/* NAVBAR */}
      <Navbar />

      <main>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* PROTECTED ROUTES */}

          <Route path="/" element={<Home />} />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            }
          />

          <Route
            path="/products/:id"
            element={
              <PrivateRoute>
                <ProductDetails />
              </PrivateRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <PrivateRoute>
                <Wishlist />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/success"
            element={
              <PrivateRoute>
                <OrderSuccess />
              </PrivateRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />
          <Route
            path="/order/:id"
            element={
              <PrivateRoute>
                <OrderDetails />
              </PrivateRoute>
            }
          />


        </Routes>
      </main>

      <ToastContainer />
      <Footer />
    </>
  )
}

export default App
