import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Provider/AuthContext";
import axios from "axios";
import DonorDashboardAside from "../../Pages/Dashboard/DonorDashboardAside/DonorDashboardAside";
import VolunteerDashboardAside from "../../Pages/Dashboard/VoluenteerDashboardAside/VoluenteerDashboardAside";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const [dbUser, setDbUser] = useState(null);

  // Only for donor: active status
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

  // Only for donor: check if active in activeDonors collection
  useEffect(() => {
    if (dbUser?.email && dbUser.role === "donor") {
      axios
        .get(`http://localhost:5000/active-donors/${dbUser.email}`)
        .then((res) => setIsActive(!!res.data))
        .catch(() => setIsActive(false));
    }
  }, [dbUser]);

  if (!dbUser) return <p className="text-center mt-10">Loading dashboard...</p>;

  return (
    <div className="flex min-h-screen">
      {/* Conditional Sidebar */}
      {dbUser.role === "donor" ? (
        <DonorDashboardAside
          dbUser={dbUser}
          isActive={isActive}
          setIsActive={setIsActive}
        />
      ) : (
        <VolunteerDashboardAside dbUser={dbUser} />
      )}

      {/* Main content */}
      <main className="flex-1 p-6">
        <Outlet context={{ dbUser, isActive }} />
      </main>
    </div>
  );
};

export default DashboardLayout;
