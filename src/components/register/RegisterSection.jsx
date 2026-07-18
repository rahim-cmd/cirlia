import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { formatApiError, getFieldErrors } from "../../utils/apiResponse";

export default function RegisterSection() {
  const navigate = useNavigate();
  const toast = useToast();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await register(form);
      toast.success("Registration successful. Please log in.");
      navigate("/login", { replace: true, state: { email: form.email } });
    } catch (requestError) {
      setFieldErrors(getFieldErrors(requestError));
      setError(formatApiError(requestError, "Registration failed."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20" style={{ background: "#FBF6F2" }}>
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full opacity-40 blur-[140px]" style={{ background: "#E7D8CE" }} />
      <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full opacity-40 blur-[150px]" style={{ background: "#BAC7B3" }} />

      <div className="relative z-10 grid w-full max-w-6xl items-center gap-16 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="hidden lg:block">
          <img src="/images/register.jpg" alt="Circlia registration" className="h-[850px] w-full rounded-[40px] object-cover shadow-2xl" />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="rounded-[40px] bg-white/70 p-10 shadow-2xl backdrop-blur-2xl md:p-14">
          <p className="mb-3 text-sm uppercase tracking-[6px]" style={{ color: "var(--color-brown)" }}>
            Welcome
          </p>

          <h1 className="mb-4 text-5xl" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Create
            <br />
            Your Account
          </h1>

          <p className="mb-10 leading-8 opacity-70">
            Become part of a beautiful community where connection, reflection and motherhood come together.
          </p>

          {error ? <p className="mb-6 rounded-2xl bg-[#fff3f0] px-4 py-3 text-sm text-[#a14a2a]">{error}</p> : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              ["first_name", "First Name", User, "text"],
              ["last_name", "Last Name", User, "text"],
              ["email", "Email Address", Mail, "email"],
              ["phone", "Phone Number", Phone, "tel"],
            ].map(([key, placeholder, Icon, type]) => (
              <div key={key} className="relative">
                <Icon size={20} className="absolute left-5 top-1/2 -translate-y-1/2 opacity-60" />
                <input
                  type={type}
                  required
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                  className="w-full rounded-full border bg-white py-4 pl-14 pr-5 outline-none"
                />
                {fieldErrors[key] ? <p className="mt-2 px-5 text-xs text-[#a14a2a]">{fieldErrors[key]}</p> : null}
              </div>
            ))}

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

            <p className="rounded-2xl border border-[#e7ddcf] bg-[#fcf7f1] px-4 py-3 text-xs leading-6 text-[#5f665f] sm:px-5 sm:text-sm">
              By registering on this website, you agree to the{" "}
              <Link to="/privacy-policy" className="font-semibold text-[#314131] underline underline-offset-4">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link to="/terms-and-conditions" className="font-semibold text-[#314131] underline underline-offset-4">
                Terms and Conditions
              </Link>
              .
            </p>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm opacity-70">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[#314131] underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
