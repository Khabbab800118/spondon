import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../../Provider/AuthContext";
import { showSuccess } from "../../Components/Alert/Alert";
import axios from "axios";

const Register = () => {
  const { createUser, setUser, updateUser } = useContext(AuthContext);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [role, setRole] = useState("donor");
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");

  const navigate = useNavigate();

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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const form = e.target;
      const name = form.name.value;
      const email = form.email.value;
      const password = form.password.value;
      const file = form.photo.files[0];

      // 🔐 Password validation
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z]).{6,}$/;
      if (!passwordRegex.test(password)) {
        setError(
          "Password must contain uppercase, lowercase and be at least 6 characters"
        );
        setLoading(false);
        return;
      }

      // 🩸 Donor validation
      if (role === "donor") {
        if (!bloodGroup || !district || !area) {
          setError("Please complete all donor information");
          setLoading(false);
          return;
        }
      }

      // 🖼️ Image upload
      const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY;
      const formData = new FormData();
      formData.append("image", file);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
        formData
      );

      const photoURL = imgRes.data.data.display_url;

      // 🔑 Create auth user
      const result = await createUser(email, password);
      const user = result.user;

      await updateUser({
        displayName: name,
        photoURL,
      });

      setUser({ ...user, displayName: name, photoURL });

      // 💾 Save user to DB
      const newUser = {
        name,
        email,
        image: photoURL,
        role,
        bloodGroup: role === "donor" ? bloodGroup : null,
        district: role === "donor" ? district : null,
        area: role === "donor" ? area : null,
      };

      await axios.post("http://localhost:5000/users", newUser);

      await showSuccess(
        "Registration Successful!",
        "Your account has been created."
      );

      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("User already exists!");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <title>Spondon | Register</title>

      <div className="hero-content flex-col">
        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-center mb-4">
              Register Now
            </h1>

            <form onSubmit={handleRegister}>
              {/* Name */}
              <label className="label">Name</label>
              <input
                disabled={loading}
                required
                name="name"
                type="text"
                className="input input-bordered w-full"
                placeholder="Your name"
              />

              {/* Photo */}
              <label className="label mt-2">Photo</label>
              <input
                disabled={loading}
                required
                name="photo"
                type="file"
                className="file-input file-input-bordered w-full"
              />

              {/* Email */}
              <label className="label mt-2">Email</label>
              <input
                disabled={loading}
                required
                name="email"
                type="email"
                className="input input-bordered w-full"
                placeholder="Email"
              />

              {/* Role */}
              <label className="label mt-2">Role</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    disabled={loading}
                    type="radio"
                    value="donor"
                    checked={role === "donor"}
                    onChange={(e) => setRole(e.target.value)}
                    className="radio radio-error"
                  />
                  Donor
                </label>

                <label className="flex items-center gap-2">
                  <input
                    disabled={loading}
                    type="radio"
                    value="volunteer"
                    checked={role === "volunteer"}
                    onChange={(e) => setRole(e.target.value)}
                    className="radio radio-error"
                  />
                  Volunteer
                </label>
              </div>

              {/* Donor Fields */}
              <label className="label mt-2">Blood Group</label>
              <select
                disabled={loading || role === "volunteer"}
                required={role === "donor"}
                className="select select-bordered w-full"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="">Select blood group</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>

              <label className="label mt-2">District</label>
              <select
                disabled={loading || role === "volunteer"}
                required={role === "donor"}
                className="select select-bordered w-full"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="">Select district</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <label className="label mt-2">Area</label>
              <input
                disabled={loading || role === "volunteer"}
                required={role === "donor"}
                className="input input-bordered w-full"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Your area"
              />

              {/* Password */}
              <label className="label mt-2">Password</label>
              <div className="relative">
                <input
                  disabled={loading}
                  required
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full"
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-neutral w-full mt-4"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>

              <p className="text-center mt-3 text-sm">
                Already have an account?{" "}
                <Link to="/auth/login" className="text-error font-semibold">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
