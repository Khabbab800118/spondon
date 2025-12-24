import React, { useEffect } from "react";
import {
  FaUser,
  FaHeartbeat,
  FaHome,
  FaToggleOn,
  FaToggleOff,
  FaHandHoldingHeart,
  FaArrowAltCircleLeft,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import { Link, NavLink } from "react-router";
import axios from "axios";

const DonorDashboardAside = ({ isActive, setIsActive, dbUser }) => {
  useEffect(() => {
    if (!dbUser?.email) return;

    axios
      .get(`http://localhost:5000/active-donors/${dbUser.email}`)
      .then((res) => {
        setIsActive(res.data.isActive);
      })
      .catch((err) => console.error(err));
  }, [dbUser, setIsActive]);

  const handleToggle = async () => {
    if (!dbUser) return; // Ensure user data is loaded

    try {
      if (!isActive) {
        // Activate donor
        await axios.post("http://localhost:5000/active-donors", dbUser);
        setIsActive(true);
      } else {
        // Deactivate donor
        await axios.delete(
          `http://localhost:5000/active-donors/${dbUser.email}`
        );
        setIsActive(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-white shadow-lg p-6">
      <Link
        to="/"
        className="text-2xl font-bold text-red-600 mb-8 block text-center"
      >
        <FaArrowAltCircleLeft></FaArrowAltCircleLeft> Home Page
      </Link>
      <Link to={"/dashboard"} className="text-2xl font-bold text-red-600 mb-8">
        Donor Dashboard
      </Link>

      <nav className="space-y-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-red-600 text-white" : "hover:bg-red-100"
            }`
          }
        >
          <FaHome /> Home
        </NavLink>

        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-red-600 text-white" : "hover:bg-red-100"
            }`
          }
        >
          <FaUser /> Profile
        </NavLink>

        <NavLink
          to="/dashboard/requests"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-red-600 text-white" : "hover:bg-red-100"
            }`
          }
        >
          <FaHeartbeat /> Requests
        </NavLink>
        <NavLink
          to="/dashboard/my-donations"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-red-600 text-white" : "hover:bg-red-100"
            }`
          }
        >
          <FaHandHoldingHeart /> My Donations
        </NavLink>
        <NavLink
          to="/dashboard/canceled-requests"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-blue-100"
            }`
          }
        >
          <FaTimesCircle className="text-red-500" /> Requests canceled by me
        </NavLink>
        <NavLink
          to="/dashboard/sent-requests"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-blue-100"
            }`
          }
        >
          <FaHourglassHalf />
          My inprogress Requests
        </NavLink>
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
