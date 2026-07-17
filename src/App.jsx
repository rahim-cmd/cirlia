import { useEffect } from "react";
import Lenis from "lenis";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import JournalPage from "./pages/JournalPage";
import ContactPage from "./pages/ContactPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import JoinCircle from "./pages/JoinCircle";
import Profile from "./pages/Profile";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import { usePopup } from "./context/PopupContext";
import JournalPopup from "./components/JournalPopup";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCircles from "./pages/AdminCircles";
import AdminUsers from "./pages/AdminUsers";
import AdminBookings from "./pages/AdminBookings";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { openPopup, closePopup } = usePopup();

  useEffect(() => {
    const isLoggedIn = Boolean(localStorage.getItem("token"));

    if (isLoggedIn) {
      closePopup();
      return;
    }

    const timer = setTimeout(() => {
      openPopup();
    }, 180000);

    return () => clearTimeout(timer);
  }, [closePopup, openPopup]);

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Register" element={<Navigate to="/register" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/circles" element={<JoinCircle />} />
        <Route path="/circle" element={<Navigate to="/circles" replace />} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/circles" element={<ProtectedRoute requireAdmin><AdminCircles /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute requireAdmin><AdminBookings /></ProtectedRoute>} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-and-conditions" element={<TermsPage />} />
      </Routes>
      <JournalPopup />
    </>
  );
}

export default App;

