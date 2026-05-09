import { Outlet } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* RIGHT CONTENT */}
      <div className="ml-64 flex flex-col flex-1">

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-10 bg-[#111111]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  )
}

export default AdminLayout
