import axios from "axios";
import React, { useEffect, useState } from "react";

const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // 🔹 Fetch ALL requests
  useEffect(() => {
    const fetchAllRequests = async () => {
      try {
        const res = await axios.get(
          "https://spondon-server.onrender.com/requests"
        );
        setRequests(res.data);
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchAllRequests();
  }, []);

  if (loadingRequests) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500 font-semibold">
        No requests found.
      </p>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">All Requests</h2>
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
              <th className="border px-2 py-1">Created At</th>
              <th className="border px-2 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => (
              <tr key={req._id} className="hover:bg-gray-50">
                <td className="border px-2 py-1">{index + 1}</td>
                <td className="border px-2 py-1">{req.recipientName}</td>
                <td className="border px-2 py-1">{req.hospitalName}</td>
                <td className="border px-2 py-1">{req.bloodGroup}</td>
                <td className="border px-2 py-1">{req.donationDate}</td>
                <td className="border px-2 py-1">{req.status}</td>
                <td className="border px-2 py-1">
                  {req.requesterEmail || "N/A"}
                </td>
                <td className="border px-2 py-1">
                  {new Date(req.createdAt).toLocaleString()}
                </td>
                <td className="border px-2 py-1">
                  <button className="btn">Donate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllRequests;
