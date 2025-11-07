import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config"; 
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${API_BASE_URL}/bookings/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setBookings(data);
      } else {
        setError("Failed to load your bookings. Please login again.");
      }
    } catch {
      setError("Error fetching bookings.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const statusColors = {
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    refunded: "bg-yellow-100 text-yellow-700",
    rescheduled: "bg-blue-100 text-blue-700",
    pending: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
           My Bookings
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {bookings.length === 0 ? (
          <p className="text-gray-600 text-center">No bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white border rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <img
                  src={b.service_image || "/logo.jpg"}
                  alt={b.service_name}
                  className="w-full h-40 object-cover rounded-t-xl"
                />
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {b.service_name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColors[b.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-1">
                    <strong>Pet:</strong> {b.pet_name}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Date:</strong> {b.appointment_date}
                  </p>
                  <p className="text-gray-600 mb-3">
                    <strong>Time:</strong> {b.appointment_time}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <button
                      onClick={() => navigate(`/booking/${b.id}`, { state: b })}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      View Details →
                    </button>
                    {b.status !== "cancelled" && (
                      <button
                        className="bg-red-500 text-white text-sm px-4 py-1 rounded-full hover:bg-red-600 transition"
                        onClick={() => alert("Cancel booking feature coming soon")}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
