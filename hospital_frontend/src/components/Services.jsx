import React, {useEffect, useState } from 'react';
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

const whatsappNumber = '8930333373'; // Use country code, e.g., 91 for India

function openWhatsApp(serviceName) {
  const message = encodeURIComponent(
    `Hello Kings Pet Hospital, I would like to book an appointment for: ${serviceName}`
  );
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
}

const Services = () => {
  const [services, setServices] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const VISIBLE_COUNT = 6;
  const visibleServices = showAll ? services : services.slice(0, VISIBLE_COUNT);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/services/`)
        const data = await response.json();

        if (response.ok) {
          setServices(data);
        } else {
          setError("Failed to load services");
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

if (loading) {
  return (
      <section className="py-20 text-center">
        <h2 className="text-2xl text-gray-600">Loading services...</h2>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 text-center">
        <h2 className="text-2xl text-red-600">{error}</h2>
      </section>
    );
  }


  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Premium Pet Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Providing top-quality care for your beloved furry friends with our comprehensive range of services
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleServices.map((service, index) => (
            <div 
              key={service.name}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{ 
                opacity: 0, 
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`,
                transform: 'translateY(20px)'
              }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={`${service.image_url}`} 
                  alt={service.name} 
                  loading="lazy"
                  className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-2 rounded-bl-lg font-semibold">
                  ₹{service.price}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3 transition-colors duration-300 hover:text-blue-600">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {service.description}
                </p>
                <div className="border-t pt-4">
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <svg
                          className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="w-full mt-6 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-blue-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => navigate(`/book/${service.id}`)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
        {services.length > VISIBLE_COUNT && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              {showAll ? 'View Less' : 'View More'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services; 