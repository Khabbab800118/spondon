import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { AuthContext } from "../../Provider/AuthContext";
import { showSuccess } from "../../Components/Alert/Alert";
import axios from "axios";

const Register = () => {
  const { createUser, setUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("donor");
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const districts = [
    "Dhaka",
    "Chattogram",
    "Khulna",
    "Rajshahi",
    "Barishal",
    "Sylhet",
    "Rangpur",
    "Mymensingh",
  ];

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;
    const photo = form.photo.value;
    const email = form.email.value;
    const password = form.password.value;

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must have uppercase, lowercase, and be 6+ characters");
      return;
    }

    // Donor-specific validation
    if (role === "donor") {
      if (!bloodGroup) {
        setError("Please select your blood group");
        return;
      }
      if (!district) {
        setError("Please select your district");
        return;
      }
      if (!area) {
        setError("Please enter your area");
        return;
      }
    }

    try {
      const result = await createUser(email, password);
      const user = result.user;

      await updateUser({
        displayName: name,
        photoURL: photo,
      });

      setUser({ ...user, displayName: name, photoURL: photo });

      const newUser = {
        name,
        email,
        image: photo,
        role,
        bloodGroup: role === "donor" ? bloodGroup : null,
        district: role === "donor" ? district : null,
        area: role === "donor" ? area : null,
      };

      const res = await axios.post("http://localhost:5000/users", newUser);
      const data = res.data;

      if (data.message === "User Already Exists") {
        setError("User Already Exists");
        return;
      }

      await showSuccess(
        "Registration Successful!",
        "Your account has been created."
      );

      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("User already exists!");
        return;
      }
      setError(err.message);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <title>Spondon-Register</title>

      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl p-5">
          <h1 className="text-5xl font-bold">Register now!</h1>
          <form onSubmit={handleRegister} className="card-body">
            <fieldset className="fieldset">
              {/* Name */}
              <label className="label">Name</label>
              <input
                required
                name="name"
                type="text"
                className="input"
                placeholder="Name"
              />

              {/* Photo */}
              <label className="label">Photo URL</label>
              <input
                required
                name="photo"
                type="text"
                className="input"
                placeholder="Photo URL"
              />

              {/* Email */}
              <label className="label">Email</label>
              <input
                required
                name="email"
                type="email"
                className="input"
                placeholder="Email"
              />

              {/* Role Selection */}
              <label className="label mt-2">Select Role</label>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="donor"
                    checked={role === "donor"}
                    onChange={(e) => setRole(e.target.value)}
                    className="radio radio-error"
                  />
                  <span>Donor</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="volunteer"
                    checked={role === "volunteer"}
                    onChange={(e) => setRole(e.target.value)}
                    className="radio radio-error"
                  />
                  <span>Volunteer</span>
                </label>
              </div>

              {/* Blood Group */}
              <label className="label mt-2">Blood Group</label>
              <select
                name="bloodGroup"
                className="select select-bordered w-full"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                disabled={role === "volunteer"}
                required={role === "donor"}
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>

              {/* District */}
              <label className="label mt-2">District</label>
              <select
                name="district"
                className="select select-bordered w-full"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={role === "volunteer"}
                required={role === "donor"}
              >
                <option value="">Select District</option>
                {districts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>

              {/* Area */}
              <label className="label mt-2">Area</label>
              <input
                type="text"
                name="area"
                className="input w-full"
                placeholder="Enter your area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                disabled={role === "volunteer"}
                required={role === "donor"}
              />

              {role === "volunteer" && (
                <p className="text-xs text-gray-500 mt-1">
                  Blood group, district, and area are not required for
                  volunteers
                </p>
              )}

              {/* Password */}
              <label className="label">Password</label>
              <div className="relative">
                <input
                  required
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="input w-full"
                  placeholder="Password"
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button type="submit" className="btn btn-neutral mt-4">
                Register
              </button>
              <small className="text-center mt-5 text-red-800">
                {error ? error : ""}
              </small>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
