import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import axios from "axios";

const DashboardHome = () => {
  const { dbUser, isActive } = useOutletContext();

  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH RECENT DONATIONS =================
  useEffect(() => {
    if (dbUser?.role === "donor" && dbUser?.email) {
      axios
        .get(
          `https://spondon-server.onrender.com/approved-requests/donor/${dbUser.email}`
        )
        .then((res) => {
          // take latest 3 donations (reverse if needed)
          const latestThree = res.data.slice(-3).reverse();
          setRecentDonations(latestThree);
        })
        .catch((err) => {
          console.error("Failed to load recent donations", err);
        })
        .finally(() => setLoading(false));
    }
  }, [dbUser]);

  return (
    <div className="min-h-screen bg-base-200 p-6">
      {/* ================= DONOR DASHBOARD ================= */}
      {dbUser?.role === "donor" && (
        <div className="max-w-5xl mx-auto space-y-6">
          {/* ===== STATUS MESSAGE ===== */}
          {isActive ? (
            <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-bold mb-2">You are active!</h2>
              <p>
                Thank you for being ready to donate blood. You can now receive
                donation requests.
              </p>
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-bold mb-2">You are inactive</h2>
              <p>
                Activate your status from the dashboard to start receiving blood
                donation requests.
              </p>
            </div>
          )}

          {/* ===== RECENT DONATIONS ===== */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Your Recent Donations</h3>

            {loading ? (
              <p className="text-gray-500">Loading donations...</p>
            ) : recentDonations.length === 0 ? (
              <p className="text-gray-500">
                You have not completed any donations yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Recipient</th>
                      <th>Blood Group</th>
                      <th>Hospital</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDonations.map((donation, index) => (
                      <tr key={donation._id}>
                        <td>{index + 1}</td>
                        <td>{donation.recipientName}</td>
                        <td>{donation.bloodGroup}</td>
                        <td>{donation.hospitalName}</td>
                        <td>
                          {new Date(donation.donationDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= ADMIN DASHBOARD ================= */}
      {dbUser?.role === "admin" && (
        <div className="max-w-xl mx-auto bg-blue-100 border border-blue-400 text-blue-800 px-6 py-4 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-2">Welcome, Admin!</h2>
          <p>
            Manage users, donors, and blood requests. Monitor activities and
            keep the system running smoothly.
          </p>
        </div>
      )}

      {/* ================= VOLUNTEER DASHBOARD ================= */}
      {dbUser?.role === "volunteer" && (
        <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome, {dbUser?.name}!</h1>
          <p className="text-gray-700">
            This is your volunteer dashboard. View assigned tasks and manage
            your availability here.
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
