import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../Provider/AuthContext";

const DashboardRequests = () => {
  const { user } = useContext(AuthContext);
  const loggedInUserEmail = user?.email;

  const [dbUser, setDbUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  // 🔹 Fetch logged-in user from DB
  useEffect(() => {
    if (!loggedInUserEmail) return;

    const fetchUserFromDB = async () => {
      try {
        const res = await axios.get(
          `https://spondon-server.onrender.com/users/${loggedInUserEmail}`
        );
        setDbUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user from DB", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserFromDB();
  }, [loggedInUserEmail]);

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

  // 🔄 Loading spinner
  if (loadingUser || loadingRequests) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!dbUser) {
    return (
      <p className="text-center mt-10 text-red-500">
        User not found in database.
      </p>
    );
  }

  // 🔹 Filter requests by blood group
  const matchedRequests = requests.filter(
    (req) => req.bloodGroup === dbUser.bloodGroup
  );

  // 🔹 Accept request handler
  const handleAcceptRequest = async (id) => {
    setApprovingId(id);

    try {
      await axios.patch(
        `https://spondon-server.onrender.com/requests/approve/${id}`
      );

      // Remove accepted request from UI
      setRequests((prev) => prev.filter((request) => request._id !== id));
    } catch (error) {
      console.error("Failed to approve request", error);
    } finally {
      setApprovingId(null);
    }
  };

  const handleCancelRequest = async (request) => {
    setCancelingId(request._id);

    try {
      // 1️⃣ Prepare canceled request
      const canceledRequest = {
        ...request,
        status: "canceled", // ✅ mark as canceled
        canceledAt: new Date(), // ✅ timestamp
        canceledByEmail: loggedInUserEmail, // ✅ who canceled it
      };

      // 2️⃣ Add to canceledRequestsCollection
      await axios.post(
        "https://spondon-server.onrender.com/canceled-requests",
        canceledRequest
      );

      // 3️⃣ Delete from requestsCollection
      await axios.delete(
        `https://spondon-server.onrender.com/requests/${request._id}`
      );

      // 4️⃣ Remove from UI
      setRequests((prev) => prev.filter((r) => r._id !== request._id));
    } catch (error) {
      console.error("Failed to cancel request", error);
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Matching Blood Requests ({matchedRequests.length})
      </h2>

      {matchedRequests.length === 0 ? (
        <p className="text-gray-500">No matching requests available.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {matchedRequests.map((request) => (
            <div key={request._id} className="border p-4 rounded shadow">
              <p>
                <strong>Patient:</strong> {request.patientName}
              </p>
              <p>
                <strong>Blood Group:</strong> {request.bloodGroup}
              </p>
              <p>
                <strong>Hospital:</strong> {request.hospitalName}
              </p>
              <p>
                <strong>Requester:</strong> {request.requesterEmail}
              </p>
              <p>
                <strong>Status:</strong> {request.status}
              </p>
              <div className="flex flex-col">
                <button
                  onClick={() => handleAcceptRequest(request._id)}
                  disabled={approvingId === request._id}
                  className="btn btn-success btn-sm mt-3"
                >
                  {approvingId === request._id ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Accept Request"
                  )}
                </button>
                <button
                  onClick={() => handleCancelRequest(request)}
                  disabled={cancelingId === request._id}
                  className="btn btn-error btn-sm mt-3"
                >
                  {cancelingId === request._id ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Cancel Request"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardRequests;
