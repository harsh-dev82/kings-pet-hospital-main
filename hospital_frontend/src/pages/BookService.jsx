import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const BookService = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [petName, setPetName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      const response = await fetch(`${API_BASE_URL}/services/${id}/`);
      const data = await response.json();
      if (response.ok) setService(data);
    };
    fetchService();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!petName || !date || !time || !email || !phone) {
      alert("Please fill all fields!");
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    try {
      // 🟢 1️⃣ Create Booking
      const bookingResponse = await fetch(`${API_BASE_URL}/bookings/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          service: id,
          pet_name: petName,
          appointment_date: date,
          appointment_time: time,
          email: email,
          phone_number: phone,
        }),
      });

      const bookingData = await bookingResponse.json();
      if (!bookingResponse.ok) {
        alert(bookingData.error || "Booking failed.");
        return;
      }

      // 💰 2️⃣ Create Razorpay Order
      const price = parseInt(service.price.replace(/[^0-9]/g, "")) || 1000;
      const orderResponse = await fetch(`${API_BASE_URL}/create-order/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: price }),
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok) {
        alert("Payment initialization failed.");
        return;
      }

      // 💳 3️⃣ Open Razorpay Checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Kings Pet Hospital",
        description: `Booking for ${service.name}`,
        image: "/logo.jpg",
        order_id: orderData.order_id,
        handler: function (response) {
          alert("Payment successful!");
          navigate("/my-bookings");
        },
        prefill: {
          name: JSON.parse(localStorage.getItem("user")).username,
          email: email,
          contact: phone,
        },
        theme: { color: "#2563EB" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error booking:", error);
      alert("Something went wrong. Try again later.");
    }
  };

  if (!service)
    return <p className="text-center py-10 text-gray-600">Loading service details...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-2xl overflow-hidden">
        <img
          src={service.image_url || "/logo.jpg"}
          alt={service.name}
          className="w-full h-80 object-cover"
        />
        <div className="p-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-3">{service.name}</h1>
          <p className="text-gray-700 mb-4">{service.description}</p>
          <p className="text-xl font-semibold text-blue-600 mb-6">
            Price: {service.price}
          </p>

          <form onSubmit={handleBooking} className="space-y-5">
            {/* 🐾 Pet Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Pet Name</label>
              <input
                type="text"
                placeholder="Enter your pet’s name"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* 📅 Appointment Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Appointment Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* 📧 Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* 📱 Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* 💳 Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Confirm Booking & Pay
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookService;
