import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { showSuccess } from "../../Components/Alert/Alert";
import { AuthContext } from "../../Provider/AuthContext";

const Login = () => {
  const { login, setUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLoginBtn = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const result = await login(email, password);
      const user = result.user;
      setUser(user);

      // Show success alert
      await showSuccess("Login Successful!", "Welcome back!");

      // Navigate after user clicks OK
      navigate(location.state ? location.state : "/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <title>Spondon-Log In</title>

      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl p-5">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <form onSubmit={handleLoginBtn} className="card-body">
            <fieldset className="fieldset">
              {/* Email */}
              <label className="label">Email</label>
              <input
                required
                name="email"
                type="email"
                className="input"
                placeholder="Email"
              />
              {/* Password */}
              <label className="label">Password</label>
              <input
                required
                name="password"
                type="password"
                className="input"
                placeholder="Password"
              />
              <div>
                <Link to="/auth/forgotPassword" className="link link-hover">
                  Forgot password?
                </Link>
              </div>
              <button type="submit" className="btn btn-neutral mt-4">
                Login
              </button>
              <small className="text-center mt-5 text-red-800">
                {error ? "Invalid Email or Password" : ""}
              </small>
              <small className="text-center mt-5">
                Don't have an account?{" "}
                <Link className="text-red-600" to={"/auth/register"}>
                  Register
                </Link>
              </small>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
