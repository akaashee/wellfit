import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom"
import { useContext } from "react"

/* USER COMPONENTS */
import Navbar from "./components/Navbar"
import Toast from "./components/Toast"
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
import Footer from "./pages/Footer"
import PaymentSuccess from "./pages/PaymentSuccess"

/* ADMIN COMPONENTS */
import AdminLogin from "./admin/pages/AdminLogin"
import Dashboard from "./admin/pages/Dashboard"
import AdminLayout from "./admin/components/AdminLayout"
import ProductsAdmin from "./admin/pages/Products"
import AddProduct from "./admin/pages/AddProduct"
import Orders from "./admin/pages/Orders"
import AdminRoute from "./admin/routes/AdminRouter"

/* CONTEXT */
import { StoreContext } from "./context/StoreContext"
import { ToastContainer } from "react-toastify"
import EditProduct from "./admin/pages/EditProduct"
import ProductView from "./admin/pages/ProductView"
import SalesAnalytics from "./admin/pages/SalesAnalytics"
import Users from "./admin/pages/Users"
import OrderDetailsAdmin from "./admin/pages/OrderDetailsAdmin"
import { useAuth } from "./context/AuthContext"

/* USER PRIVATE ROUTE */
const PrivateRoute = ({ children }) => {
  const isAuth = localStorage.getItem("isAuth")
  return isAuth ? children : <Navigate to="/login" />
}

const PublicRoute = ({ children }) => {
  const isAuth = localStorage.getItem("isAuth")
  return !isAuth ? children : <Navigate to="/" />
}

function App() {
  const { toastMessage } = useContext(StoreContext)
  const location = useLocation()

  console.log(location);
  

  // 👉 Hide Navbar & Footer for Admin pages
  const isAdminRoute = location.pathname.startsWith("/admin")
  const navigate = useNavigate()

  const { user } = useAuth()

  if (user && user?.role === "admin" && !isAdminRoute) navigate('/admin')

  return (
    <>
      {/* TOAST */}
      <Toast />
      <ToastContainer />

      {/* NAVBAR (USER ONLY) */}
      {!isAdminRoute && <Navbar />}

      <main>
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ================= USER ROUTES ================= */}
          <Route path="/" element={<Home />} />

          <Route path="/products" element={<Products />} />

          <Route path="/products/:id" element={<ProductDetails />} />

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

          <Route
            path="/order/:id"
            element={
              <PrivateRoute>
                <OrderDetails />
              </PrivateRoute>
            }
          />

          <Route
            path="/payment-success"
            element={
              <PrivateRoute>
                <PaymentSuccess />
              </PrivateRoute>
            }
          />

          {/* ================= ADMIN ROUTES ================= */}
          <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="products/add" element={<AddProduct />} />
              <Route path="products/view/:id" element={<ProductView />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetailsAdmin />} />
            <Route path="users" element={<Users />} />
            <Route path="sales-analytics" element={<SalesAnalytics />} />
          </Route>

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* FOOTER (USER ONLY) */}
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App
