import React from "react";
import {
  FaUserShield,
  FaHome,
  FaUsers,
  FaHandHoldingHeart,
  FaHeartbeat,
  FaChartBar,
  FaArrowAltCircleLeft,
  FaTimesCircle,
} from "react-icons/fa";
import { Link, NavLink } from "react-router";

const AdminDashboardAside = () => {
  return (
    <aside className="w-64 min-h-screen bg-white shadow-lg p-6">
      <Link to="/" className="text-2xl font-bold text-red-600 mb-8 block">
        <FaArrowAltCircleLeft></FaArrowAltCircleLeft> Home Page
      </Link>
      <Link
        to="/dashboard"
        className="text-2xl font-bold text-red-600 mb-8 block"
      >
        Admin Dashboard
      </Link>

      <nav className="space-y-4">
        {/* Home */}
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

        {/* Admin Profile */}
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-red-600 text-white" : "hover:bg-red-100"
            }`
          }
        >
          <FaUserShield /> Profile
        </NavLink>

        {/* Manage Users */}
        <NavLink
          to="/dashboard/manage-users"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-red-600 text-white" : "hover:bg-red-100"
            }`
          }
        >
          <FaUsers /> Manage Users
        </NavLink>

        {/* Manage Requests */}
        <NavLink
          to="/dashboard/manage-requests"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-red-600 text-white" : "hover:bg-red-100"
            }`
          }
        >
          <FaHeartbeat /> Manage Requests
        </NavLink>

        {/* Manage Donations */}
        <NavLink
          to="/dashboard/manage-donations"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-red-600 text-white" : "hover:bg-red-100"
            }`
          }
        >
          <FaHandHoldingHeart /> Manage Donations
        </NavLink>
        {/* Manage Canceled Requests */}
        <NavLink
          to="/dashboard/manage-canceled-requests"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-blue-100"
            }`
          }
        >
          <FaTimesCircle className="text-red-500" /> Manage Canceled Requests
        </NavLink>

        {/* Reports / Analytics */}
        <NavLink
          to="/dashboard/reports"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-red-600 text-white" : "hover:bg-red-100"
            }`
          }
        >
          <FaChartBar /> Reports
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminDashboardAside;
