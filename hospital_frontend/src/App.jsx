import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Services from "./components/Services";
import About from "./components/About";
import Gallery from "./components/Gallery";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBookings from "./pages/AdminBookings";
import AdminServices from "./pages/AdminServices";
import MyBookings from "./pages/MyBookings";
import BookService from "./pages/BookService";
import AdminUsers from "./pages/AdminUsers";


// 🔒 Protected Route Component for Admins
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppContent() {
  const location = useLocation();

  // 🧠 Keep user state persistent
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 🧹 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  // 🧭 Hide header/footer on login & signup pages
  const hideHeaderFooter =
    location.pathname === "/login" || location.pathname === "/signup";

  // 🧩 Keep user data updated (e.g., if localStorage changes)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && !user) {
      setUser(JSON.parse(storedUser));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {!hideHeaderFooter && <Header user={user} onLogout={handleLogout} />}

      <main className="relative z-10">
        <Routes>
          {/* 🔒 Admin Panel (Protected Route) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user}>
                <AdminDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute user={user}>
                <AdminBookings onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/services"
            element={
              <ProtectedRoute user={user}>
                <AdminServices onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute user={user}>
                <AdminUsers onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={user ? <MyBookings /> : <Navigate to="/login" replace />}
          />

          <Route path="/book/:id" element={<BookService />} />


          {/* 🏠 Home Page */}
          <Route
            path="/"
            element={
              <>
                <Services />
                <Gallery />
                <About />
              </>
            }
          />

          {/* 🔑 Auth Pages */}
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* 🚫 Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
