import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../Provider/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/users/${user.email}`)
        .then((res) => {
          setDbUser(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (!user || !dbUser) {
    return <p className="text-center mt-10">Profile not found</p>;
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card bg-base-100 w-full max-w-md shadow-xl p-6">
        <div className="flex flex-col items-center">
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border"
          />

          <h2 className="text-2xl font-bold mt-4">{user.displayName}</h2>
          <p className="text-gray-600">{user.email}</p>

          <div className="divider"></div>

          <div className="w-full space-y-2">
            <p>
              <span className="font-semibold">Role:</span>{" "}
              {dbUser.role || "Not set"}
            </p>

            {dbUser.role === "donor" && (
              <p>
                <span className="font-semibold">Blood Group:</span>{" "}
                {dbUser.bloodGroup || "Not set"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
