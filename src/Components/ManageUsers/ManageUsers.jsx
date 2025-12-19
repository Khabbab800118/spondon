import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaTrash, FaToggleOn, FaToggleOff, FaUsers } from "react-icons/fa";
import { AuthContext } from "../../Provider/AuthContext";

const ManageUsers = () => {
  const { user: currentUser } = useContext(AuthContext); // logged-in admin
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    // Prevent self-disable
    if (currentUser?.email === users.find((u) => u._id === id)?.email) {
      alert("You cannot disable yourself!");
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/users/${id}`, {
        isDisabled: !currentStatus,
      });
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isDisabled: !currentStatus } : user
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    // Prevent self-delete
    if (currentUser?.email === users.find((u) => u._id === id)?.email) {
      alert("You cannot delete yourself!");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading users...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">{error}</p>
    );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaUsers /> Manage Users
      </h2>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="hover">
                <td>{index + 1}</td>
                <td>{user.name || "N/A"}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm capitalize ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-600"
                        : user.role === "volunteer"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      user.isDisabled
                        ? "bg-gray-200 text-gray-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {user.isDisabled ? "Disabled" : "Enabled"}
                  </span>
                </td>
                <td className="flex justify-center gap-4">
                  {/* Toggle (disabled for self) */}
                  <button
                    onClick={() =>
                      handleToggleStatus(user._id, user.isDisabled)
                    }
                    className={`text-2xl ${
                      user.isDisabled ? "text-gray-500" : "text-green-500"
                    }`}
                    title={
                      currentUser?.email === user.email
                        ? "Cannot disable yourself"
                        : "Enable / Disable"
                    }
                  >
                    {user.isDisabled ? <FaToggleOff /> : <FaToggleOn />}
                  </button>

                  {/* Delete (hidden for self) */}
                  {currentUser?.email !== user.email && (
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-500 text-lg"
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
