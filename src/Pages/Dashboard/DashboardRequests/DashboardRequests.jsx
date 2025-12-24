import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../Provider/AuthContext";
import { showSuccess } from "../../../Components/Alert/Alert";

const DashboardRequests = () => {
  const { user: authUser } = useContext(AuthContext); // logged-in donor from AuthContext
  const [donor, setDonor] = useState(null); // donor data from backend
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authUser?.email) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // 1️⃣ Fetch donor data from MongoDB
        const donorRes = await axios.get(
          `http://localhost:5000/users/${authUser.email}`
        );
        setDonor(donorRes.data);

        // 2️⃣ Fetch all requests
        const requestsRes = await axios.get(`http://localhost:5000/requests`);

        // 3️⃣ Filter requests to match donor's blood group
        const donorBloodGroup = donorRes.data?.bloodGroup;
        const filteredRequests = Array.isArray(requestsRes.data)
          ? requestsRes.data.filter((req) => req.bloodGroup === donorBloodGroup)
          : [];

        setRequests(filteredRequests);
      } catch (err) {
        console.error(err);
        setError("Failed to load donor or requests data");
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authUser?.email]);

  const handleAcceptRequest = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/requests/approve/${id}`);

      setRequests((prev) => prev.filter((req) => req._id !== id));

      showSuccess("Request accepted successfully!");
    } catch (err) {
      console.error(err);
      showSuccess("Failed to accept request");
    }
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!donor) return <p>Donor data not found.</p>;

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        Requests Matching Your Blood Group ({donor.bloodGroup})
      </h2>

      {requests.length === 0 ? (
        <p>No requests matching your blood group.</p>
      ) : (
        <div className="space-y-5">
          {requests.map((req) => (
            <div
              key={req._id}
              className="p-5 border rounded-lg shadow-sm bg-white"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <p>
                  <strong>Recipient:</strong> {req.recipientName}
                </p>
                <p>
                  <strong>Blood Group:</strong> {req.bloodGroup}
                </p>
                <p>
                  <strong>Hospital:</strong> {req.hospitalName}
                </p>
                <p>
                  <strong>Address:</strong> {req.fullAddress}
                </p>
                <p>
                  <strong>District:</strong> {req.recipientDistrict}
                </p>
                <p>
                  <strong>Area:</strong> {req.recipientArea}
                </p>
                <p>
                  <strong>Date:</strong> {req.donationDate}
                </p>
                <p>
                  <strong>Time:</strong> {req.donationTime}
                </p>

                <p className="md:col-span-2">
                  <strong>Message:</strong> {req.message || "N/A"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-yellow-600 font-semibold">
                    {req.status}
                  </span>
                </p>

                {req.status === "pending" && (
                  <button
                    className="btn bg-green-500 text-white mt-2"
                    onClick={() => handleAcceptRequest(req._id)}
                  >
                    Accept Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardRequests;
