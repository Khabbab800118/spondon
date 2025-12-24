import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { AuthContext } from "../../Provider/AuthContext";
import { showSuccess } from "../Alert/Alert";
import { FaHeart, FaBars, FaUser } from "react-icons/fa";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutBtn = async () => {
    try {
      await logOut();
      showSuccess("Logged Out Successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="navbar bg-base-100 px-4">
      {/* LEFT: Logo + Mobile Menu */}
      <div className="navbar-start">
        {/* Mobile Hamburger */}
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            <FaBars size={20} />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/all-active-donors">
                <FaUser className="text-green-500" />
                All Active Donors
              </Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            {!user && (
              <li>
                <Link to="/auth/login">Login</Link>
              </li>
            )}
            {user && (
              <li>
                <button onClick={handleLogoutBtn}>Logout</button>
              </li>
            )}
          </ul>
        </div>

        {/* Logo */}
        <Link
          to="/"
          className="btn btn-ghost text-2xl lg:text-3xl text-[#880808]"
        >
          SPONDON
        </Link>
      </div>

      {/* CENTER: Desktop Links */}
      <div className="navbar-center hidden lg:flex">
        <NavLink to="/all-active-donors" className="btn btn-ghost text-lg">
          <FaUser className="text-green-500" />
          All Active Donors
        </NavLink>
        <NavLink to="/all-requests" className="btn btn-ghost text-lg">
          <FaUser className="text-red-500" />
          All Blood Requests
        </NavLink>
      </div>

      {/* RIGHT: Desktop Actions */}
      <div className="navbar-end hidden lg:flex gap-3">
        <Link to="/dashboard" className="btn">
          Dashboard
        </Link>

        {user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src={user?.photoURL || "https://i.ibb.co/2kRZ5q0/user.png"}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-40 p-2 shadow"
            >
              <li>
                <button onClick={handleLogoutBtn}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/auth/login" className="btn">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
