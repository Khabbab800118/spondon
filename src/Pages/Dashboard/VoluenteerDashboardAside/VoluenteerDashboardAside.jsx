import { Link, NavLink } from "react-router";
import { FaHome, FaClipboardList, FaUser, FaPaperPlane } from "react-icons/fa";

const VolunteerDashboardAside = () => {
  return (
    <aside className="w-64 min-h-screen bg-white shadow-lg p-6">
      <Link to={"/dashboard"} className="text-2xl font-bold text-blue-600 mb-8">
        Volunteer Dashboard
      </Link>
      <nav className="space-y-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-blue-100"
            }`
          }
        >
          <FaHome /> Home
        </NavLink>
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-blue-100"
            }`
          }
        >
          <FaUser /> Profile
        </NavLink>
        <NavLink
          to="/dashboard/sent-requests"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-blue-100"
            }`
          }
        >
          <FaPaperPlane /> Sent Requests
        </NavLink>
      </nav>
    </aside>
  );
};

export default VolunteerDashboardAside;
