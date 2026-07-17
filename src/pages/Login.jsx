import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import LoginSection from "../components/login/LoginSection";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAuthLoading, role } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate(role === "admin" ? "/admin" : "/dashboard", { replace: true });
    }
  }, [isAuthenticated, isAuthLoading, navigate, role]);

  return (
    <>
      <MainLayout>
        <LoginSection />
        <Footer />
      </MainLayout>
    </>
  );
};

export default Login;