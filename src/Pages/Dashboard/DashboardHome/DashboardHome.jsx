import React from "react";
import { useOutletContext } from "react-router";

const DashboardHome = () => {
  const { dbUser, isActive } = useOutletContext(); // Get isActive from DashboardLayout
  console.log(dbUser);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-4">
      {dbUser.role === "donor" ? (
        <div>
          {isActive ? (
            <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg shadow-md text-center max-w-xl">
              <h2 className="text-2xl font-bold mb-2">You are active!</h2>
              <p className="text-lg">
                Thank you for being ready to donate blood. You are now available
                to receive blood donation requests.
              </p>
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg shadow-md text-center max-w-xl">
              <h2 className="text-2xl font-bold mb-2">You are inactive</h2>
              <p className="text-lg">
                Activate your status from the dashboard to start receiving blood
                donation requests.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-4">
            <h1 className="text-3xl font-bold mb-4">
              Welcome, {dbUser?.name}!
            </h1>
            <p className="text-lg text-gray-700">
              This is your volunteer dashboard. Here you can view assigned
              tasks, volunteer requests, and manage your availability.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
