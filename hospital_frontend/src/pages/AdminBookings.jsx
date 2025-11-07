import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";  // assuming layout‐wrapper from previous step
import { API_BASE_URL } from "../config";


const AdminBookings = ({ onLogout }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rescheduleDateTime, setRescheduleDateTime] = useState("");


  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${API_BASE_URL}/bookings/all/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setBookings(data);
      } else {
        setError("Failed to load bookings.");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, status, date = null, time = null) => {
    const token = localStorage.getItem("access");

    const body = { status };
    if (status === "rescheduled" && date && time) {
      body.appointment_date = date;
      body.appointment_time = time;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Booking ${status} successfully!`);
        fetchBookings(); // refresh list
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      alert("Server error while updating booking.");
    }
  };

  // 🗓 Open Reschedule Modal
  const openRescheduleModal = (booking) => {
    setSelectedBooking(booking);
    setRescheduleDateTime("");
    setShowModal(true);
  };

  // 🕒 Confirm Reschedule Booking
  const confirmReschedule = async () => {
    if (!rescheduleDateTime) {
      alert("Please select a new date and time.");
      return;
    }

    const [date, time] = rescheduleDateTime.split("T");
    await handleStatusChange(selectedBooking.id, "rescheduled", date, time);
    setShowModal(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Customer Bookings</h2>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading bookings…</p>
        ) : error ? (
          <p className="text-center text-red-500 py-10">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">User</th>
                  <th className="py-3 px-4 text-left">Service</th>
                  <th className="py-3 px-4 text-left">Pet Name</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Time</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t hover:bg-gray-50 transition duration-150">
                    <td className="py-3 px-4">{b.id}</td>
                    <td className="py-3 px-4">{b.user_email}</td>
                    <td classValues="py-3 px-4">{b.service_name}</td>
                    <td className="py-3 px-4">{b.pet_name}</td>
                    <td className="py-3 px-4">{b.appointment_date}</td>
                    <td className="py-3 px-4">{b.appointment_time}</td>
                    <td className="py-3 px-4 capitalize font-semibold">{b.status}</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      {["confirmed", "cancelled", "refunded" ].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(b.id, status,b.appointment_date, b.appointment_time)}
                          className={`px-3 py-1 rounded text-white text-sm ${
                            status === "confirmed"
                              ? "bg-green-600 hover:bg-green-700"
                              : status === "cancelled"
                              ? "bg-red-500 hover:bg-red-600"
                              : status === "refunded"
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                      <button
                        onClick={() => openRescheduleModal(b)}
                        className="px-3 py-1 rounded bg-blue-500 text-white text-sm hover:bg-blue-600"
                      >
                        Reschedule
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🗓️ Reschedule Modal */}
      {showModal && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
        <div
          className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm transform transition-all scale-100 animate-fadeIn"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-5 text-center">
            Reschedule Booking:{" "}
            <span className="text-gray-800 font-semibold">{selectedBooking?.id}</span>
          </h2>

          <div className="mb-5">
            <label
              htmlFor="datetime"
              className="block text-gray-700 font-medium mb-2 text-left"
            >
              Select New Date & Time
            </label>
            <input
              id="datetime"
              type="datetime-local"
              value={rescheduleDateTime}
              onChange={(e) => setRescheduleDateTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmReschedule}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Confirm Reschedule
            </button>
          </div>
        </div>
      </div>
    )}

    </AdminLayout>
  );
};

export default AdminBookings;
