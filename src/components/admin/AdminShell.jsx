import { NavLink, useNavigate } from "react-router-dom";
import { CalendarDays, LayoutGrid, ListChecks, LogOut, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import CircleCursor from "../CircleCursor";

const navigation = [
  { to: "/admin", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/admin/circles", label: "Circles", icon: CalendarDays },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/bookings", label: "Bookings", icon: ListChecks },
];

export default function AdminShell({ title, subtitle, actions, children }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.info("You have been signed out.");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f8f2eb] p-4 text-[#243224] md:p-6 lg:p-8">
      <CircleCursor />
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[240px_1fr]">
        <aside className="rounded-[32px] border border-[#e7ddcf] bg-white p-5 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.25)]">
          <p className="text-sm uppercase tracking-[5px] text-[#8b6e63]">Circlia admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#314131]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Control center
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#5f665f]">
            Signed in as {user?.first_name || user?.email || "Admin"}.
          </p>

          <nav className="mt-8 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive ? "bg-[#314131] text-white" : "text-[#314131] hover:bg-[#f4e8db]"
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#e5d8cc] px-4 py-3 text-sm font-semibold text-[#314131]"
          >
            <LogOut size={16} />
            Logout
          </button>
        </aside>

        <section className="space-y-6">
          <header className="rounded-[32px] border border-[#efe7dc] bg-[#314131] p-6 text-white shadow-[0_24px_80px_-40px_rgba(0,0,0,0.3)] md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[4px] text-[#d8e8d2]">Backend connected</p>
                <h2 className="mt-2 text-3xl font-semibold" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  {title}
                </h2>
                {subtitle ? <p className="mt-3 max-w-2xl text-sm leading-7 text-[#edf2eb]">{subtitle}</p> : null}
              </div>
              {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
            </div>
          </header>

          {children}
        </section>
      </div>
    </div>
  );
}