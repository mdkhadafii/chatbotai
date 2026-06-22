import { Outlet } from "react-router-dom";

import Sidebar from "../components/admin/Sidebar.jsx";
import Topbar from "../components/admin/Topbar.jsx";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <div className="min-w-0">
        <Topbar />
        <main className="p-4 md:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
