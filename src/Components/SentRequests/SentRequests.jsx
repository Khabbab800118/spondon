import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../Provider/AuthContext";
import { showSuccess } from "../Alert/Alert";

const SentRequests = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch user's requests
  useEffect(() => {
    const fetchMyRequests = async () => {
      if (!user?.email) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/requests/user/${user.email}`
        );
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;

    try {
      setDeletingId(id);
      await axios.delete(`http://localhost:5000/requests/${id}`);
      // Remove the deleted request from state
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (err) {
      console.error(err);
      await showSuccess("Failed to delete request");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <p className="text-center mt-6">Loading your requests...</p>;
  }

  if (requests.length === 0) {
    return (
      <p className="text-center mt-6">You have not made any requests yet.</p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Sent Requests</h2>
      <div className="flex flex-wrap gap-6">
        {requests.map((req) => (
          <div
            key={req._id}
            className="flex-1 min-w-[280px] max-w-sm border rounded shadow-lg p-4 bg-white relative"
          >
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
              <strong>Address:</strong> {req.fullAddress}, {req.recipientArea},{" "}
              {req.recipientDistrict}
            </p>
            <p>
              <strong>Date & Time:</strong> {req.donationDate} at{" "}
              {req.donationTime}
            </p>
            <p>
              <strong>Message:</strong> {req.message}
            </p>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(req._id)}
              disabled={deletingId === req._id}
              className="mt-4 w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
            >
              {deletingId === req._id ? "Deleting..." : "Delete Request"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentRequests;
