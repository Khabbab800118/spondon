import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Provider/AuthContext";
import axios from "axios";
import DonorDashboardAside from "../../Pages/Dashboard/DonorDashboardAside/DonorDashboardAside";
import VolunteerDashboardAside from "../../Pages/Dashboard/VoluenteerDashboardAside/VoluenteerDashboardAside";
import { Outlet } from "react-router";
import AdminDashboardAside from "../../Pages/AdminDashboardAside/AdminDashboardAside";

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const [dbUser, setDbUser] = useState(null);

  // Only for donor
  const [isActive, setIsActive] = useState(false);

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

  if (!dbUser) return <p className="text-center mt-10">Loading dashboard...</p>;

  // 🔹 Sidebar selection using if–else
  let sidebar = null;

  if (dbUser.role === "donor") {
    sidebar = (
      <DonorDashboardAside
        dbUser={dbUser}
        isActive={isActive}
        setIsActive={setIsActive}
      />
    );
  } else if (dbUser.role === "volunteer") {
    sidebar = <VolunteerDashboardAside dbUser={dbUser} />;
  } else if (dbUser.role === "admin") {
    sidebar = <AdminDashboardAside dbUser={dbUser} />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {sidebar}

      {/* Main content */}
      <main className="flex-1 p-6">
        <Outlet context={{ dbUser, isActive }} />
      </main>
    </div>
  );
};

export default DashboardLayout;
