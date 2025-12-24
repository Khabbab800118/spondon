import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaHeartbeat,
  FaUser,
  FaHospital,
  FaMapMarkerAlt,
  FaTint,
  FaTrash,
} from "react-icons/fa";
import { showSuccess } from "../Alert/Alert";

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://spondon-server.onrender.com/requests"
      );
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Delete a request
  const handleDeleteRequest = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this request?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`https://spondon-server.onrender.com/requests/${id}`);
      // Remove deleted request from UI
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (err) {
      console.error(err);
      showSuccess("Failed to delete request");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-700 font-medium">
        Loading requests...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">{error}</p>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <FaHeartbeat className="text-red-600" /> Manage Requests
      </h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                #
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Requester
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Recipient
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Blood Group
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Hospital
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Location
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {requests.map((req, index) => (
              <tr key={req._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>

                <td className="px-4 py-3 flex items-center gap-2 text-sm text-gray-700">
                  <FaUser className="text-gray-400" />
                  {req.requesterName}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {req.requesterEmail}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {req.recipientName}
                </td>

                <td className="px-4 py-3">
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 font-semibold text-sm flex items-center gap-1">
                    <FaTint className="inline" /> {req.bloodGroup}
                  </span>
                </td>

                <td className="px-4 py-3 flex items-center gap-2 text-sm text-gray-700">
                  <FaHospital className="text-gray-400" />
                  {req.hospitalName}
                </td>

                <td className="px-4 py-3 flex items-center gap-2 text-sm text-gray-700">
                  <FaMapMarkerAlt className="text-gray-400" />
                  {req.district}, {req.area}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      req.status === "approved"
                        ? "bg-green-100 text-green-600"
                        : req.status === "rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {req.status || "inprogress"}
                  </span>
                </td>

                {/* Delete Action */}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDeleteRequest(req._id)}
                    className="text-red-500 hover:text-red-700 text-lg"
                    title="Delete Request"
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

export default ManageRequests;
