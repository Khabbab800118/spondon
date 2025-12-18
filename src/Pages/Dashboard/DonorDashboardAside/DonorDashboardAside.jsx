import { useContext, useEffect, useState } from "react";
import {
  FaUser,
  FaHeartbeat,
  FaHome,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { NavLink } from "react-router";
import { AuthContext } from "../../../Provider/AuthContext";
import axios from "axios";

const DonorDashboardAside = () => {
  // State to toggle Active / Deactive
  const [isActive, setIsActive] = useState(true);
  const { user } = useContext(AuthContext);
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/users/${user.email}`)
        .then((res) => setDbUser(res.data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  const handleToggle = async () => {
    setIsActive(!isActive);

    try {
      if (!isActive) {
        // Activate donor
        await axios.post("http://localhost:5000/active-donors", dbUser);
      } else {
        // Deactivate donor
        await axios.delete(
          `http://localhost:5000/active-donors/${dbUser.email}`
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-white shadow-lg p-6">
      {/* Logo / Title */}
      <h2 className="text-2xl font-bold text-red-600 mb-8">Donor Dashboard</h2>

      {/* Navigation */}
      <nav className="space-y-4">
        {/* Home Button */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-red-600 text-white" : "hover:bg-red-100"
            }`
          }
        >
          <FaHome />
          Home
        </NavLink>

        {/* Profile */}
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-red-600 text-white" : "hover:bg-red-100"
            }`
          }
        >
          <FaUser />
          Profile
        </NavLink>

        {/* Requests */}
        <NavLink
          to="/dashboard/requests"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-red-600 text-white" : "hover:bg-red-100"
            }`
          }
        >
          <FaHeartbeat />
          Requests
        </NavLink>

        {/* Active / Deactive Toggle */}
        <button
          onClick={handleToggle}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition w-full ${
            isActive ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
          }`}
        >
          {isActive ? <FaToggleOn /> : <FaToggleOff />}
          {isActive ? "Active" : "Deactive"}
        </button>
      </nav>
    </aside>
  );
};

export default DonorDashboardAside;
