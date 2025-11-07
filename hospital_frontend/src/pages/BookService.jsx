import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const BookService = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [petName, setPetName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
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

    if (!petName || !date || !time) {
      alert("Please fill all fields!");
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    // 1️⃣ Create Booking
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
      }),
    });

    const bookingData = await bookingResponse.json();
    if (!bookingResponse.ok) {
      alert("Booking failed.");
      return;
    }

    // 2️⃣ Create Razorpay Order
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

    // 3️⃣ Open Razorpay Checkout
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
        email: JSON.parse(localStorage.getItem("user")).email,
      },
      theme: { color: "#2563EB" },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  if (!service) return <p className="text-center py-10">Loading...</p>;

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
          <p className="text-xl font-semibold text-blue-600 mb-4">
            Price: {service.price}
          </p>

          <form onSubmit={handleBooking} className="space-y-4">
            <input
              type="text"
              placeholder="Pet Name"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full border p-3 rounded-lg"
              required
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border p-3 rounded-lg"
              required
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border p-3 rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
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
