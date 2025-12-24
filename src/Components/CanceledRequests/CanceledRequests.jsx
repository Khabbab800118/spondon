import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Provider/AuthContext";
import axios from "axios";

const CanceledRequests = () => {
  const { user } = useContext(AuthContext);
  const loggedInUserEmail = user?.email;

  const [canceledRequests, setCanceledRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loggedInUserEmail) return;

    const fetchCanceledRequests = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/canceled-requests?email=${loggedInUserEmail}`
        );
        setCanceledRequests(res.data);
      } catch (error) {
        console.error("Failed to fetch canceled requests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCanceledRequests();
  }, [loggedInUserEmail]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // 🔹 Filter canceled requests by donorEmail
  const myCanceledRequests = canceledRequests.filter(
    (request) => request.donorEmail === loggedInUserEmail
  );

  if (myCanceledRequests.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No canceled requests found for you.
      </p>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Canceled Requests</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {myCanceledRequests.map((request) => (
          <div key={request._id} className="border p-4 rounded shadow">
            <p>
              <strong>Recipient:</strong> {request.recipientName}
            </p>
            <p>
              <strong>Hospital:</strong> {request.hospitalName}
            </p>
            <p>
              <strong>Blood Group:</strong> {request.bloodGroup}
            </p>
            <p>
              <strong>Donation Date:</strong> {request.donationDate}
            </p>
            <p>
              <strong>Donation Time:</strong> {request.donationTime}
            </p>
            <p>
              <strong>Status:</strong> {request.status}
            </p>
            <p>
              <strong>Canceled At:</strong>{" "}
              {new Date(request.canceledAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CanceledRequests;
