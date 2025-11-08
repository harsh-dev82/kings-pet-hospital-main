import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { API_BASE_URL } from "../config";

const AdminUsers = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🧩 Fetch users from Django backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${API_BASE_URL}/users/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        setUsers(data);
      } else {
        setError("Failed to load users.");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🗑️ Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${API_BASE_URL}/users/${userId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setUsers(users.filter((user) => user.id !== userId));
        alert("User deleted successfully.");
      } else {
        alert("Failed to delete user.");
      }
    } catch (error) {
      console.error(error);
      alert("Server error while deleting user.");
    }
  };

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Manage Users
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading users...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-10">{error}</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Username</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t hover:bg-gray-50 transition duration-150"
                  >
                    <td className="py-3 px-4">{user.id}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {user.username}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{user.email}</td>
                    <td className="py-3 px-4 capitalize">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {user.role !== "admin" ? (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      ) : (
                        <span className="text-gray-400 italic">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
