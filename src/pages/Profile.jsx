import { useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock3, Mail, ShieldCheck, UserCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Footer from "../components/Footer";

const getStoredUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      return null;
    }

    const parsedUser = JSON.parse(storedUser);
    if (typeof parsedUser === "string") {
      return { first_name: parsedUser, last_name: "", email: "" };
    }

    return parsedUser;
  } catch (error) {
    console.error("Unable to read user details", error);
    return null;
  }
};

const getStoredBookings = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedBookings = localStorage.getItem("userBookings");
    return storedBookings ? JSON.parse(storedBookings) : [];
  } catch (error) {
    console.error("Unable to read user bookings", error);
    return [];
  }
};

export default function Profile() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const bookings = getStoredBookings();
  const uniqueBookings = bookings.filter((booking, index, array) => {
    const currentKey = booking.circleId || booking.id || booking.title;
    return array.findIndex((item) => (item.circleId || item.id || item.title) === currentKey) === index;
  });
  const fullName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "Guest user";

  useEffect(() => {
    const token = (localStorage.getItem("token") || "").trim();

    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const profileDetails = [
    {
      label: "Full name",
      value: fullName || "Guest user",
      icon: UserCircle2,
    },
    {
      label: "Email",
      value: user?.email || "No email provided",
      icon: Mail,
    },
    {
      label: "Current booking",
      value: uniqueBookings[0]?.title || "No active booking",
      icon: CalendarDays,
    },
    {
      label: "Booking status",
      value: uniqueBookings[0]?.status || "Not requested",
      icon: ShieldCheck,
    },
  ];

  return (
    <MainLayout hideNavbar>
      <div className="mx-4 my-8 md:mx-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[35px] border border-[#efe7dc] bg-white p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.2)] lg:p-10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[5px] text-[#8B6E63]">Your profile</p>
              <h1
                className="mt-3 text-4xl lg:text-5xl"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Welcome, {user?.first_name || "friend"}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
                Here you can review your account details and keep track of every circle request you have made.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-sage)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Back to dashboard
            </Link>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {profileDetails.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-[24px] border border-[#efe7dc] bg-[#f8f1e8] p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[3px] text-[#7A8E7B]">
                    <Icon size={16} /> {item.label}
                  </div>
                  <p className="mt-3 text-lg font-semibold text-[#314131]">{item.value}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-[28px] border border-[#efe7dc] bg-[#fffaf2] p-6">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[3px] text-[#7A8E7B]">
              <Clock3 size={16} /> Circle activity
            </div>

            {uniqueBookings.length > 0 ? (
              <div className="mt-4 space-y-3">
                {uniqueBookings.map((booking, index) => (
                  <div key={`${booking.circleId || index}`} className="rounded-[20px] border border-[#e8d8b8] bg-white p-4 text-sm text-gray-700">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <span className="font-semibold text-[#314131]">{booking.title}</span>
                      <span className="rounded-full bg-[#f8f1e8] px-3 py-1 text-xs uppercase tracking-[3px] text-[#7A8E7B]">
                        {booking.status}
                      </span>
                    </div>
                    {booking.meetingLink ? (
                      <p className="mt-2 text-sm text-green-700">Zoom access is ready for this circle.</p>
                    ) : (
                      <p className="mt-2 text-sm text-gray-600">Your booking is still pending approval or waiting for its meeting access.</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-gray-600">No circle activity yet. Start by booking your first circle from the dashboard.</p>
            )}
          </div>
        </motion.section>
      </div>
      <Footer />
    </MainLayout>
  );
}
