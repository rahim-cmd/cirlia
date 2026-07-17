import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { formatApiError, getFieldErrors } from "../../utils/apiResponse";

export default function LoginSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({
    email: location.state?.email || "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const user = await login(form);
      toast.success("Login successful.");
      navigate(user?.role === "admin" ? "/admin" : location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (requestError) {
      setFieldErrors(getFieldErrors(requestError));
      setError(formatApiError(requestError, "Login failed."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="min-h-screen relative flex items-center justify-center overflow-hidden px-6 py-20"
      style={{ background: "#FBF6F2" }}
    >
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full opacity-40 blur-[120px]" style={{ background: "#D8C8BC" }} />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full opacity-40 blur-[140px]" style={{ background: "#B5BFAE" }} />

      <div className="relative z-10 grid w-full max-w-6xl items-center gap-14 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="hidden lg:block">
          <img src="/images/login.jpg" alt="Circlia member login" className="h-[720px] w-full rounded-[40px] object-cover shadow-2xl" />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="rounded-[40px] bg-white/70 p-10 shadow-2xl backdrop-blur-2xl md:p-14">
          <p className="mb-3 text-sm uppercase tracking-[6px]" style={{ color: "var(--color-brown)" }}>
            Welcome Back
          </p>

          <h1 className="mb-4 text-5xl" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Sign In To
            <br />
            Your Circle
          </h1>

          <p className="mb-10 leading-8 opacity-70">
            Step back into your circle space and manage your upcoming gatherings.
          </p>

          {error ? <p className="mb-6 rounded-2xl bg-[#fff3f0] px-4 py-3 text-sm text-[#a14a2a]">{error}</p> : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 opacity-60" />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-full border bg-white py-4 pl-14 pr-5 outline-none"
              />
              {fieldErrors.email ? <p className="mt-2 px-5 text-xs text-[#a14a2a]">{fieldErrors.email}</p> : null}
            </div>

            <div className="relative">
              <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 opacity-60" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-full border bg-white py-4 pl-14 pr-14 outline-none"
              />
              <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-5 top-1/2 -translate-y-1/2 opacity-70">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {fieldErrors.password ? <p className="mt-2 px-5 text-xs text-[#a14a2a]">{fieldErrors.password}</p> : null}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Signing in..." : "Login"}
            </Button>

            <p className="text-center text-sm opacity-70">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-semibold text-[#314131] underline underline-offset-4">
                Create one
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
