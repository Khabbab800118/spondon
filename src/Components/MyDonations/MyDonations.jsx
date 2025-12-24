import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../Provider/AuthContext";

const MyDonations = () => {
  const { user } = useContext(AuthContext);
  const email = user?.email;

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) return;

    const fetchMyDonations = async () => {
      try {
        setLoading(true);
        setError("");

        // GET all approved requests assigned to this donor
        const res = await axios.get(
          `http://localhost:5000/approved-requests/donor/${email}`
        );
        setDonations(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load donations");
      } finally {
        setLoading(false);
      }
    };

    fetchMyDonations();
  }, [email]);

  if (loading) return <p>Loading your donations...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        My Donations ({donations.length})
      </h2>

      {donations.length === 0 ? (
        <p>No donations found</p>
      ) : (
        <div className="space-y-5">
          {donations.map((donation) => (
            <div
              key={donation._id}
              className="p-5 border rounded-lg shadow-sm bg-white"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <p>
                  <strong>Recipient:</strong> {donation.recipientName}
                </p>
                <p>
                  <strong>Blood Group:</strong> {donation.bloodGroup}
                </p>
                <p>
                  <strong>Hospital:</strong> {donation.hospitalName}
                </p>
                <p>
                  <strong>Address:</strong> {donation.fullAddress}
                </p>
                <p>
                  <strong>District:</strong> {donation.recipientDistrict}
                </p>
                <p>
                  <strong>Area:</strong> {donation.recipientArea}
                </p>
                <p>
                  <strong>Date:</strong> {donation.donationDate}
                </p>
                <p>
                  <strong>Time:</strong> {donation.donationTime}
                </p>
                <p>
                  <strong>Requester Email:</strong> {donation.requesterEmail}
                </p>
                <p>
                  <strong>Message:</strong> {donation.message || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-green-600 font-semibold">
                    {donation.status}
                  </span>
                </p>
                <p>
                  <strong>Approved At:</strong>{" "}
                  {donation.approvedAt
                    ? new Date(donation.approvedAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDonations;
