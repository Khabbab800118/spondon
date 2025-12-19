import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Provider/AuthContext";
import axios from "axios";
import { Outlet } from "react-router";
import { FaBars } from "react-icons/fa";

import DonorDashboardAside from "../../Pages/Dashboard/DonorDashboardAside/DonorDashboardAside";
import VolunteerDashboardAside from "../../Pages/Dashboard/VoluenteerDashboardAside/VoluenteerDashboardAside";
import AdminDashboardAside from "../../Pages/AdminDashboardAside/AdminDashboardAside";

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const [dbUser, setDbUser] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch user from backend
  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/users/${user.email}`)
        .then((res) => setDbUser(res.data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  // Check donor active status
  useEffect(() => {
    if (dbUser?.email && dbUser.role === "donor") {
      axios
        .get(`http://localhost:5000/active-donors/${dbUser.email}`)
        .then((res) => setIsActive(!!res.data))
        .catch(() => setIsActive(false));
    }
  }, [dbUser]);

  if (!dbUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // 🔹 Sidebar selection
  let SidebarComponent = null;

  if (dbUser.role === "donor") {
    SidebarComponent = (
      <DonorDashboardAside
        dbUser={dbUser}
        isActive={isActive}
        setIsActive={setIsActive}
      />
    );
  } else if (dbUser.role === "volunteer") {
    SidebarComponent = <VolunteerDashboardAside dbUser={dbUser} />;
  } else if (dbUser.role === "admin") {
    SidebarComponent = <AdminDashboardAside dbUser={dbUser} />;
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Top bar (mobile only) */}
      <div className="navbar bg-base-100 shadow lg:hidden">
        <button className="btn btn-ghost" onClick={() => setSidebarOpen(true)}>
          <FaBars size={22} />
        </button>
        <h2 className="font-semibold text-lg ml-2 capitalize">
          {dbUser.role} Dashboard
        </h2>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 min-h-screen bg-base-100 shadow">
          {SidebarComponent}
        </aside>

        {/* Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black bg-opacity-40"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className="relative w-64 h-full bg-base-100 shadow-lg">
              <button
                className="btn btn-ghost absolute right-2 top-2"
                onClick={() => setSidebarOpen(false)}
              >
                ✕
              </button>
              {SidebarComponent}
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet context={{ dbUser, isActive }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
