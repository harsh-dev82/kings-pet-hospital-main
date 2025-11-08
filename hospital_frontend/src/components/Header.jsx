import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";


const whatsappNumber = '+918930333373';
function openWhatsApp(serviceName = '') {
  const message = encodeURIComponent(
    `Hello Kings Pet Hospital, I would like to book an appointment${serviceName ? ' for: ' + serviceName : ''}`
  );
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
}

const Header = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

    // 🟦 Check if we are on admin dashboard route
  const isDashboard = location.pathname === "/";
  const isAdminPage = !isDashboard

  // 🧠 Dynamic navbar background color logic
  const navClasses = `
    fixed w-full z-50 transition-all duration-300 
    ${isAdminPage ? "bg-blue-700 shadow-md py-4" 
    : isScrolled ? "bg-white shadow-md py-4" 
    : "bg-transparent py-6"}
  `;

  const linkColorClasses = isAdminPage
    ? "text-white hover:text-blue-200"
    : isScrolled
    ? "text-gray-600 hover:text-blue-600"
    : "text-white hover:text-blue-200";

  return (
    <header className="relative">
      {/* Navigation Bar */}
      <nav className={navClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img
                src="/logo.jpg"
                alt="Kings Pet Hospital logo"
                className="h-10 w-auto rounded-sm bg-white/90 p-1 shadow-sm"
              />
              <Link to="/" className="no-underline">
                <h1
                  className={`text-2xl font-bold cursor-pointer transition-colors duration-300 ${
                    isAdminPage
                      ? "text-white hover:text-blue-200"
                      : isScrolled
                      ? "text-blue-600 hover:text-blue-800"
                      : "text-white hover:text-blue-200"
                  }`}
                >
                  Kings Pet Hospital
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {!isAdminPage &&
                ["Services", "Gallery", "About", "Contact"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className={`transition-colors duration-300 ${linkColorClasses}`}
                  >
                    {item}
                  </a>
              ))}

              {/* ✅ Conditional Section */}
              {user ? (
                <>
                  {/* Show Admin only for admin */}
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className={`transition-colors duration-300 ${linkColorClasses}`}
                    >
                      Admin 
                    </Link>
                  )}

                  {user && (
                    <Link
                      to="/my-bookings"
                      className={`transition-colors duration-300 ${linkColorClasses}`}
                    >
                      My Bookings
                    </Link>
                  )}


                  {/* Logout Button */}
                  <button
                    onClick={onLogout}
                    className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
                      isAdminPage
                        ? "border border-white text-white hover:bg-white hover:text-blue-700"
                        : isScrolled
                        ? "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        : "border border-white text-white hover:bg-white hover:text-red-600"
                    }`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Login & Signup Buttons (Visible only when not logged in) */}
                  <a
                    href="/login"
                    className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
                      isScrolled
                        ? 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                        : 'border border-white text-white hover:bg-white hover:text-blue-600'
                    }`}
                  >
                    Login
                  </a>
                  <a
                    href="/signup"
                    className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
                      isScrolled
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Signup
                  </a>
                </>
              )}

              {/* Book Appointment Button (always visible) */}
              <button
                className={`px-6 py-2 rounded-full font-semibold transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isScrolled
                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                    : 'bg-white text-blue-600 hover:bg-blue-50 focus:ring-white'
                }`}
                onClick={() => openWhatsApp()}
              >
                For Consultation
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-inset ${
                  isScrolled
                    ? 'text-gray-600 hover:text-gray-800 focus:ring-blue-500'
                    : 'text-white hover:text-gray-200 focus:ring-white'
                }`}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg mt-2 shadow-lg transform transition-all duration-300 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
                {['Services', 'Gallery', 'About', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-300"
                  >
                    {item}
                  </a>
                ))}

                {/* ✅ Conditional Section for Mobile */}
                {user ? (
                  <>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block w-full text-center px-4 py-3 border border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
                      >
                        Admin 
                      </Link>
                    )}
                    <button
                      onClick={onLogout}
                      className="block w-full text-center px-4 py-3 border border-red-500 text-red-500 rounded-full font-semibold hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/login"
                      className="block w-full text-center px-4 py-3 border border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
                    >
                      Login
                    </a>
                    <a
                      href="/signup"
                      className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all duration-300"
                    >
                      Signup
                    </a>
                  </>
                )}

                {/* Book Appointment Button */}
                <button
                  className="w-full mt-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold transition-all duration-300 hover:bg-blue-700 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => openWhatsApp()}
                >
                  For Consultation
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      {location.pathname === "/" && (
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0 transform transition-all duration-500 opacity-0 translate-y-4 animate-[fadeIn_0.5s_ease-out_forwards]">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Your Pet Deserves <br />
                <span className="text-blue-200">The Best Care</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Professional pet care services to keep your furry friend healthy and happy.
                Expert veterinarians, modern facilities, and loving attention.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* 🟦 Book Now Button — Scrolls to Services */}
                <button
                  onClick={() => {
                    const servicesSection = document.getElementById("services");
                    if (servicesSection) {
                      servicesSection.scrollIntoView({ behavior: "smooth" });
                    } else {
                      window.location.href = "/#services";
                    }
                  }}
                  className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold transition-all duration-300 hover:bg-blue-50 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                >
                  Book Now
                </button>

                {/* 💬 WhatsApp Button — Opens Chat */}
                <button
                  onClick={() => openWhatsApp()}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-green-500 text-white rounded-full font-semibold transition-all duration-300 hover:bg-green-600 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                >
                  <img
                    src="/whatsapp-icon.png"
                    alt="WhatsApp"
                    className="w-5 h-5"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg";
                    }}
                  />
                  WhatsApp
                </button>
              </div>
            </div>
            <div className="md:w-1/2 transform transition-all duration-500 opacity-0 translate-y-4 animate-[fadeIn_0.5s_ease-out_0.3s_forwards]">
              <img
                src="50.jpg"
                alt="Happy dog with veterinarian"
                className="rounded-lg shadow-2xl transform transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/logo.jpg';
                }}
              />
            </div>
          </div>
        </div>
      </div>
      )}
    </header>
  );
};

export default Header;
