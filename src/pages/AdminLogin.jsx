import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { formatApiError, getFieldErrors } from "../utils/apiResponse";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { isAuthenticated, isAuthLoading, login, role, logout } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) {
      return;
    }

    navigate(role === "admin" ? "/admin" : "/dashboard", { replace: true });
  }, [isAuthenticated, isAuthLoading, navigate, role]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const user = await login(form);
      const normalizedRole = String(user?.role || "user").toLowerCase();

      if (normalizedRole !== "admin") {
        await logout();
        throw new Error("This account does not have admin access.");
      }

      toast.success("Admin login successful.");
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (requestError) {
      setFieldErrors(getFieldErrors(requestError));
      setError(formatApiError(requestError, "Admin login failed."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-route min-h-screen bg-[linear-gradient(135deg,#fbf6f2_0%,#f4e5d8_100%)] px-4 py-16 text-[#243224]">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[40px] border border-[#efe2d3] bg-white shadow-[0_30px_80px_-25px_rgba(0,0,0,0.25)] lg:flex-row">
        <div className="flex-1 bg-[#314131] p-10 text-white lg:p-14">
          <p className="text-sm uppercase tracking-[6px] text-[#d7e6d1]">Protected access</p>
          <h1 className="mt-4 text-4xl font-semibold" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Circlia Admin Console
          </h1>
          <p className="mt-4 max-w-md text-lg leading-8 text-[#e8ece4]">
            Manage circles, approve bookings, and oversee members from one secure command center.
          </p>
          <div className="mt-8 rounded-[24px] border border-white/20 bg-white/10 p-5 text-sm leading-7">
            <p className="font-semibold">Live backend access</p>
            <p>Use an admin account from your backend environment.</p>
            <p className="mt-2 text-[#e8ece4]">Non-admin accounts are redirected out of this panel.</p>
          </div>
        </div>

        <div className="flex-1 p-8 lg:p-14">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[5px] text-[#8b6e63]">Sign in</p>
              <h2 className="mt-3 text-3xl font-semibold">Admin login</h2>
            </div>

            {error ? <p className="rounded-2xl bg-[#fff3f0] p-3 text-sm text-[#a14a2a]">{error}</p> : null}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#314131]">Email</span>
              <div className="flex items-center gap-3 rounded-full border border-[#e3d7ca] bg-[#fcf7f1] px-4 py-3">
                <Mail size={18} className="text-[#8b6e63]" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  className="w-full bg-transparent outline-none"
                  placeholder="admin@circlia.com"
                />
              </div>
              {fieldErrors.email ? <p className="mt-2 text-xs text-[#a14a2a]">{fieldErrors.email}</p> : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#314131]">Password</span>
              <div className="flex items-center gap-3 rounded-full border border-[#e3d7ca] bg-[#fcf7f1] px-4 py-3">
                <Lock size={18} className="text-[#8b6e63]" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  className="w-full bg-transparent outline-none"
                  placeholder="••••••••"
                />
              </div>
              {fieldErrors.password ? <p className="mt-2 text-xs text-[#a14a2a]">{fieldErrors.password}</p> : null}
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-[#314131] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Signing in..." : "Access admin dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
