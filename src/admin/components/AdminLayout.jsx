import { Outlet } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* RIGHT CONTENT */}
      <div className="ml-64 flex min-h-screen flex-col">
       

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
