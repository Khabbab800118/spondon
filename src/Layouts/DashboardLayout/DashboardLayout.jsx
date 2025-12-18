import React from "react";
import { Outlet } from "react-router";
import DonorDashboardAside from "../../Pages/Dashboard/DonorDashboardAside/DonorDashboardAside";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64">
        <DonorDashboardAside />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
