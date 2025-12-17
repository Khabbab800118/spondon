import React, { useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../Provider/AuthContext";
import { showSuccess } from "../Alert/Alert";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const handleLogoutBtn = async () => {
    try {
      await logOut();

      showSuccess("Logged Out Successfully");

      navigator("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="navbar bg-base-100 justify-between">
      <div className="">
        <Link to={"/"} className="btn btn-ghost text-3xl text-[#880808]">
          SPONDON
        </Link>
      </div>
      <div className="flex gap-3">
        <div>
          <Link to={"/dashboard"} className="btn ">
            Dashboard
          </Link>
        </div>
        <div>
          {user ? (
            <div className="flex gap-2">
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img
                      alt="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      src={user?.photoURL}
                    />
                  </div>
                </div>
                <ul
                  tabIndex="-1"
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <Link to={"/profile"} className="justify-between">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogoutBtn}>Logout</button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div>
              <Link to={"/auth/login"} className="btn">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
