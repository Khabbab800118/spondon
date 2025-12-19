import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../Provider/AuthContext";
import { showSuccess } from "../../../Components/Alert/Alert";

const DashboardRequests = () => {
  const { user } = useContext(AuthContext);
  const email = user?.email;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) return;

    const fetchRequestsForDonor = async () => {
      try {
        setLoading(true);
        setError("");

        // 1️⃣ Get user data to retrieve bloodGroup
        const userRes = await axios.get(
          `https://spondon-server.onrender.com/users/${email}`
        );
        const bloodGroup = userRes.data?.bloodGroup;

        if (!bloodGroup) {
          setError("User blood group not found");
          setRequests([]);
          return;
        }

        // 2️⃣ Fetch all requests matching donor's blood group
        const requestsRes = await axios.get(
          `https://spondon-server.onrender.com/requests?bloodGroup=${bloodGroup}`
        );

        setRequests(Array.isArray(requestsRes.data) ? requestsRes.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load requests");
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestsForDonor();
  }, [email]);

  // ✅ Accept request handler
  const handleAcceptRequest = async (id) => {
    try {
      await axios.patch(
        `https://spondon-server.onrender.com/requests/approve/${id}`
      );

      // Remove the approved request from the UI immediately
      setRequests((prev) => prev.filter((req) => req._id !== id));

      showSuccess("Request accepted successfully!");
    } catch (err) {
      console.error(err);
      showSuccess("Failed to accept request");
    }
  };

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        Blood Requests Matching You
      </h2>

      {requests.length === 0 ? (
        <p>No matching requests found</p>
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

                {/* ✅ Accept Request Button */}
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
