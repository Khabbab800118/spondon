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

const ManageDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all approved donations
  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/approved-requests");
      setDonations(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch approved donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // Delete approved donation
  const handleDeleteDonation = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this approved donation?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/approved-requests/${id}`);
      // Remove from UI
      setDonations((prev) => prev.filter((donation) => donation._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete donation");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-700 font-medium">
        Loading donations...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">{error}</p>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <FaHeartbeat className="text-red-600" /> Manage Donations
      </h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                #
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Donor
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
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {donations.map((donation, index) => (
              <tr key={donation._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>

                <td className="px-4 py-3 flex items-center gap-2 text-sm text-gray-700">
                  <FaUser className="text-gray-400" />
                  {donation.requesterName}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {donation.requesterEmail}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {donation.recipientName}
                </td>

                <td className="px-4 py-3">
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 font-semibold text-sm flex items-center gap-1">
                    <FaTint className="inline" /> {donation.bloodGroup}
                  </span>
                </td>

                <td className="px-4 py-3 flex items-center gap-2 text-sm text-gray-700">
                  <FaHospital className="text-gray-400" />
                  {donation.hospitalName}
                </td>

                <td className="px-4 py-3 flex items-center gap-2 text-sm text-gray-700">
                  <FaMapMarkerAlt className="text-gray-400" />
                  {donation.district}, {donation.upazila}
                </td>

                {/* Delete Action */}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDeleteDonation(donation._id)}
                    className="text-red-500 hover:text-red-700 text-lg"
                    title="Delete Donation"
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

export default ManageDonations;
