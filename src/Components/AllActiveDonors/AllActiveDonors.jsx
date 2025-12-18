import React, { useEffect, useState } from "react";
import axios from "axios";

const AllActiveDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clickedDonors, setClickedDonors] = useState([]); // Track clicked donors

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("http://localhost:5000/active-donors");
        console.log("API response:", res.data);

        if (Array.isArray(res.data)) {
          setDonors(res.data);
        } else {
          console.warn("Unexpected API response:", res.data);
          setError("Unexpected API response");
        }

        setLoading(false);
      } catch (err) {
        console.error("API error:", err);
        setError("Failed to fetch donors. Check console for details.");
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  const handleSendRequest = (email) => {
    // Here you can also make an API call to send the request if needed
    console.log("Request sent to:", email);

    // Add donor email to clickedDonors array to disable the button
    setClickedDonors((prev) => [...prev, email]);
  };

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
              <strong>Blood Group:</strong> {donor.bloodGroup}
            </p>
            <p>
              <strong>Area:</strong> {donor.area}
            </p>
            <p>
              <strong>District:</strong> {donor.district}
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
            <button
              className="btn btn-primary w-full"
              onClick={() => handleSendRequest(donor.email)}
              disabled={clickedDonors.includes(donor.email)}
            >
              {clickedDonors.includes(donor.email) ? "Request Sent" : "Send Request"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllActiveDonors;
