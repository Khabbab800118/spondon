import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const ManageCanceledRequests = () => {
  const [canceledRequests, setCanceledRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all canceled requests
  const fetchCanceledRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/canceled-requests");
      setCanceledRequests(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load canceled requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCanceledRequests();
  }, []);

  // Delete canceled request
  const handleDeleteCanceledRequest = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this canceled request?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/canceled-requests/${id}`);
      setCanceledRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Failed to delete canceled request", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">{error}</p>
    );

  if (canceledRequests.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No canceled requests found.
      </p>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Manage Canceled Requests</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full min-w-[800px] border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">#</th>
              <th className="border px-2 py-1">Recipient</th>
              <th className="border px-2 py-1">Hospital</th>
              <th className="border px-2 py-1">Blood Group</th>
              <th className="border px-2 py-1">Donation Date</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Added By</th>
              <th className="border px-2 py-1">Canceled By</th>
              <th className="border px-2 py-1">Canceled At</th>
              <th className="border px-2 py-1 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {canceledRequests.map((request, index) => (
              <tr key={request._id} className="hover:bg-gray-50">
                <td className="border px-2 py-1">{index + 1}</td>
                <td className="border px-2 py-1">{request.recipientName}</td>
                <td className="border px-2 py-1">{request.hospitalName}</td>
                <td className="border px-2 py-1">{request.bloodGroup}</td>
                <td className="border px-2 py-1">{request.donationDate}</td>
                <td className="border px-2 py-1">{request.status}</td>
                <td className="border px-2 py-1">
                  {request.requesterEmail || "N/A"}
                </td>
                <td className="border px-2 py-1">
                  {request.canceledByEmail || "N/A"}
                </td>
                <td className="border px-2 py-1">
                  {new Date(request.canceledAt).toLocaleString()}
                </td>
                <td className="border px-2 py-1 text-center">
                  <button
                    onClick={() => handleDeleteCanceledRequest(request._id)}
                    className="text-red-500 text-lg"
                    title="Delete Canceled Request"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCanceledRequests;
