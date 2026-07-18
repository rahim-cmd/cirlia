import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock3, Mail, ShieldCheck, UserCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../lib/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { extractList, formatApiError } from "../utils/apiResponse";
import { normalizeBooking } from "../utils/entities";
import { humanizeStatus } from "../utils/formatters";

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

export default function Profile() {
  const navigate = useNavigate();
  const { user: contextUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState("");

  const user = contextUser || getStoredUser();

  const uniqueBookings = useMemo(
    () =>
      bookings.filter((booking, index, array) => {
        const currentKey = booking.circle_id || booking.id || booking.circle_title;
        return array.findIndex((item) => (item.circle_id || item.id || item.circle_title) === currentKey) === index;
      }),
    [bookings]
  );

  const latestBooking = currentBooking || uniqueBookings[0] || null;
  const fullName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "Guest user";

  useEffect(() => {
    const token = (localStorage.getItem("token") || "").trim();

    if (!token) {
      navigate("/login", { replace: true });
    }

    let ignore = false;

    const loadBookings = async () => {
      try {
        const [profilePayload, bookingsPayload] = await Promise.all([
          apiClient.get(API_ENDPOINTS.auth.profile, { requiresAuth: true }),
          apiClient.get(API_ENDPOINTS.bookings.mine, { requiresAuth: true }),
        ]);

        const profileData = profilePayload?.data || profilePayload || {};
        const profileCurrentBooking = profileData?.current_booking || profileData?.currentBooking;

        if (!ignore) {
          setBookings(extractList(bookingsPayload).map(normalizeBooking));
          setCurrentBooking(profileCurrentBooking ? normalizeBooking(profileCurrentBooking) : null);
          setBookingError("");
        }
      } catch (requestError) {
        if (!ignore) {
          setBookingError(formatApiError(requestError, "Unable to load your booking details."));
          setBookings([]);
          setCurrentBooking(null);
        }
      } finally {
        if (!ignore) {
          setIsLoadingBookings(false);
        }
      }
    };

    loadBookings();

    return () => {
      ignore = true;
    };
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
      value: latestBooking?.circle_title || "No active booking",
      icon: CalendarDays,
    },
    {
      label: "Booking status",
      value: latestBooking ? humanizeStatus(latestBooking.booking_status || latestBooking.status) : "Not requested",
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

            {isLoadingBookings ? (
              <p className="mt-4 text-gray-600">Loading your circle activity...</p>
            ) : bookingError ? (
              <p className="mt-4 text-[#8f3e27]">{bookingError}</p>
            ) : uniqueBookings.length > 0 ? (
              <div className="mt-4 space-y-3">
                {uniqueBookings.map((booking, index) => (
                  <div key={`${booking.circle_id || booking.id || index}`} className="rounded-[20px] border border-[#e8d8b8] bg-white p-4 text-sm text-gray-700">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <span className="font-semibold text-[#314131]">{booking.circle_title}</span>
                      <span className="rounded-full bg-[#f8f1e8] px-3 py-1 text-xs uppercase tracking-[3px] text-[#7A8E7B]">
                        {humanizeStatus(booking.booking_status || booking.status)}
                      </span>
                    </div>
                    {booking.zoom_link ? (
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
