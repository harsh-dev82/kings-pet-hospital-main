import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { API_BASE_URL } from "../config";

const AdminServices = ({ onLogout }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    features: "",
    image: null,
  });

  // 🔹 Fetch services from backend
  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${API_BASE_URL}/services/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setServices(data);
      else alert("Failed to load services");
    } catch (err) {
      console.error(err);
      alert("Server error while loading services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 🔹 Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setNewService({ ...newService, image: files[0] });
    else setNewService({ ...newService, [name]: value });
  };

// 🔹 Open Modal for Editing
  const handleEdit = (service) => {
    setIsEditing(true);
    setCurrentServiceId(service.id);
    setNewService({
      name: service.name || "",
      description: service.description || "",
      price: service.price || "",
      features: service.features ? service.features.join(", ") : "",
      image: null,
    });
    setShowModal(true); // ✅ Open modal here
  };

  // 🔹 Add or Update Service
  const handleSaveService = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newService.name);
    formData.append("description", newService.description);
    formData.append("price", newService.price);

    const featuresArray = newService.features
      ? newService.features.split(",").map((f) => f.trim())
      : [];
    formData.append("features", JSON.stringify(featuresArray));

    if (newService.image) {
      formData.append("image", newService.image);
    }

    const token = localStorage.getItem("access");
    const method = isEditing ? "PATCH" : "POST";
    const url = isEditing
      ? `${API_BASE_URL}/services/${currentServiceId}/`
      : `${API_BASE_URL}/services/`;

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert(isEditing ? "✅ Service updated successfully!" : "✅ Service added successfully!");
        setShowModal(false);
        setIsEditing(false);
        setCurrentServiceId(null);
        setNewService({
          name: "",
          description: "",
          price: "",
          features: "",
          image: null,
        });
        fetchServices(); // refresh table
      } else {
        alert(data.detail || "Failed to save service");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while saving service");
    }
  };

  // 🔹 Delete service
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${API_BASE_URL}/services/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setServices(services.filter((s) => s.id !== id));
      } else {
        alert("Failed to delete service");
      }
    } catch {
      alert("Error deleting service");
    }
  };

  // 🔹 Reset Modal State
  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentServiceId(null);
    setNewService({
      name: "",
      description: "",
      price: "",
      features: "",
      image: null,
    });
  };

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Services</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + Add New Service
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No services found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Image</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr
                    key={service.id}
                    className="border-t hover:bg-gray-50 transition duration-150"
                  >
                    <td className="py-3 px-4">{service.id}</td>
                    <td className="py-3 px-4 font-semibold">{service.name}</td>
                    <td className="py-3 px-4">{service.price}</td>
                    <td className="py-3 px-4">
                      <img
                        src={service.image_url || "/logo.jpg"}
                        alt={service.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="py-3 px-4 text-gray-600 line-clamp-2">
                      {service.description}
                    </td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    {showModal && (
      <div style={{ marginTop: "75px" }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg transform transition-all scale-100 animate-fadeIn">
          <h2 className="text-2xl font-bold text-blue-600 mb-5 text-center">
            {isEditing ? "Edit Service" : "Add New Service"}
          </h2>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Name</label>
              <input
                type="text"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                placeholder="Enter service name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                placeholder="Enter service description"
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Price</label>
              <input
                type="text"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                placeholder="e.g. From ₹2000"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Features (comma separated)
              </label>
              <textarea
                value={newService.features}
                onChange={(e) =>
                  setNewService({ ...newService, features: e.target.value })
                }
                placeholder="e.g. Laceration repair, Abscess drainage, Simple lump removal"
                rows="2"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewService({ ...newService, image: e.target.files[0] })}
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => {
                setShowModal(false);
                setIsEditing(false);
                setCurrentServiceId(null);
                setNewService({ name: "", description: "", price: "", features: "", image: null });
              }}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveService}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              {isEditing ? "Update Service" : "Save Service"}
            </button>
          </div>
        </div>
      </div>
    )}

    </AdminLayout>
  );
};

export default AdminServices;
