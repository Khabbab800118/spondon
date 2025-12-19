import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { AuthContext } from "../../Provider/AuthContext";

const AllActiveDonors = () => {
  const { user } = useContext(AuthContext);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    // Wait until user is loaded
    if (!user?.email) return;

    const fetchUserStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/users/${user.email}`
        );
        setIsDisabled(res.data?.isDisabled || false);
      } catch (err) {
        console.error("Failed to fetch user status", err);
      }
    };

    const fetchDonors = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get("http://localhost:5000/active-donors");
        if (Array.isArray(res.data)) {
          setDonors(res.data);
        } else {
          console.warn("Unexpected API response:", res.data);
          setError("Unexpected API response");
        }
      } catch (err) {
        console.error("API error:", err);
        setError("Failed to fetch donors. Check console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatus();
    fetchDonors();
  }, [user?.email]);

  // If user is not yet loaded
  if (!user) return <p className="text-center mt-10">Loading user info...</p>;

  if (loading)
    return <p className="text-center mt-10">Loading active donors...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (donors.length === 0)
    return <p className="text-center mt-10">No active donors found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {donors.map((donor) => (
        <div
          key={donor.email}
          className="card bg-base-100 shadow-lg border rounded-lg overflow-hidden flex flex-col"
        >
          {/* Donor Image */}
          {donor.image ? (
            <figure className="h-48 w-full">
              <img
                src={donor.image}
                alt={donor.name}
                className="object-cover h-full w-full"
              />
            </figure>
          ) : (
            <figure className="h-48 w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </figure>
          )}

          {/* Donor Details */}
          <div className="card-body flex-1">
            <h2 className="card-title text-primary">{donor.name}</h2>
            <p>
              <strong>Email:</strong> {donor.email}
            </p>
            <p>
              <strong>Blood Group:</strong> {donor.bloodGroup || "N/A"}
            </p>
            <p>
              <strong>Area:</strong> {donor.area || "N/A"}
            </p>
            <p>
              <strong>District:</strong> {donor.district || "N/A"}
            </p>
            <p>
              <strong>Role:</strong> {donor.role}
            </p>
            <p>
              <strong>Activated At:</strong>{" "}
              {donor.activatedAt
                ? new Date(donor.activatedAt).toLocaleString()
                : "N/A"}
            </p>
          </div>

          {/* Send Request Button */}
          <div className="card-actions p-4">
            <Link
              to={"/request"}
              className={`btn w-full text-center ${
                isDisabled
                  ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                  : "bg-primary hover:bg-primary-focus"
              }`}
              onClick={(e) => isDisabled && e.preventDefault()}
            >
              {isDisabled ? "Request Disabled" : "Click to send Request"}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllActiveDonors;
