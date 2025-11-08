import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { API_BASE_URL } from "../config";

const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [earnings, setEarnings] = useState(0);

  // Fetch all data
  const fetchData = async () => {
    const token = localStorage.getItem("access");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [usersRes, bookingsRes, servicesRes, earningsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/users/`, { headers }),
        fetch(`${API_BASE_URL}/bookings/all/`, { headers }),
        fetch(`${API_BASE_URL}/services/`),
        fetch(`${API_BASE_URL}/admin/earnings/`, { headers }), // 💰 New API
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (bookingsRes.ok) setBookings(await bookingsRes.json());
      if (servicesRes.ok) setServices(await servicesRes.json());

      if (earningsRes.ok) {
        const data = await earningsRes.json();
        setEarnings(data.total_earnings || 0);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AdminLayout onLogout={onLogout}>
      {/* 🧮 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-600 text-center">
          <h3 className="text-gray-500 text-lg mb-2">Total Users</h3>
          <p className="text-4xl font-bold text-blue-600">{users.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500 text-center">
          <h3 className="text-gray-500 text-lg mb-2">Total Bookings</h3>
          <p className="text-4xl font-bold text-green-600">{bookings.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-yellow-500 text-center">
          <h3 className="text-gray-500 text-lg mb-2">Total Services</h3>
          <p className="text-4xl font-bold text-yellow-600">{services.length}</p>
        </div>

        {/* 💰 Total Earnings */}
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-purple-500 text-center">
          <h3 className="text-gray-500 text-lg mb-2">Total Earnings</h3>
          <p className="text-4xl font-bold text-purple-600">
            ₹{Number(earnings).toLocaleString()}
          </p>
        </div>
      </div>

      {/* 🐾 Recent Bookings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Recent Bookings
        </h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-blue-600 text-white text-left">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Pet</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((b) => (
                  <tr
                    key={b.id}
                    className="border-t hover:bg-gray-50 transition duration-150"
                  >
                    <td className="py-3 px-4 font-medium">{b.user_email}</td>
                    <td className="py-3 px-4">{b.service_name}</td>
                    <td className="py-3 px-4">{b.pet_name}</td>
                    <td className="py-3 px-4">{b.appointment_date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          b.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : b.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : b.status === "refunded"
                            ? "bg-yellow-100 text-yellow-700"
                            : b.status === "rescheduled"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {b.status}
                      </span>
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

export default AdminDashboard;
