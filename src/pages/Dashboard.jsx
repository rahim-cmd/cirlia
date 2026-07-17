import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, Link as LinkIcon, LogOut } from "lucide-react";
import MainLayout from "../layout/MainLayout";
import Footer from "../components/Footer";
import StatusBadge from "../components/ui/StatusBadge";
import { ErrorState, LoadingState } from "../components/ui/LoadingState";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { API_ENDPOINTS } from "../config/api";
import { apiClient } from "../lib/apiClient";
import { extractList, formatApiError } from "../utils/apiResponse";
import { normalizeBooking } from "../utils/entities";
import { formatDisplayDate, formatTimeRange, humanizeStatus } from "../utils/formatters";

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const { logout, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    let ignore = false;

    const loadInitialBookings = async () => {
      try {
        const payload = await apiClient.get(API_ENDPOINTS.bookings.mine, { requiresAuth: true });

        if (!ignore) {
          setBookings(extractList(payload).map(normalizeBooking));
        }
      } catch (requestError) {
        if (!ignore) {
          setError(formatApiError(requestError, "Unable to load your bookings."));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadInitialBookings();

    return () => {
      ignore = true;
    };
  }, []);

  const loadBookings = async () => {
    setIsLoading(true);
    setError("");

    try {
      const payload = await apiClient.get(API_ENDPOINTS.bookings.mine, { requiresAuth: true });
      setBookings(extractList(payload).map(normalizeBooking));
    } catch (requestError) {
      setError(formatApiError(requestError, "Unable to load your bookings."));
    } finally {
      setIsLoading(false);
    }
  };

  const bookingSummary = useMemo(
    () => ({
      total: bookings.length,
      approved: bookings.filter((booking) => booking.booking_status === "approved").length,
      pending: bookings.filter((booking) => booking.booking_status === "pending").length,
    }),
    [bookings]
  );

  const getZoomStateLabel = (booking) => {
    if (booking.booking_status === "pending") {
      return "Waiting for approval";
    }

    if (booking.booking_status === "rejected") {
      return "Booking rejected";
    }

    if (booking.booking_status === "cancelled") {
      return "Booking cancelled";
    }

    if (booking.zoom_status === "updated") {
      return "Meeting link updated";
    }

    if (booking.zoom_status === "unavailable") {
      return "Meeting link unavailable";
    }

    if (booking.zoom_status === "expired") {
      return "Meeting completed";
    }

    if (booking.zoom_status === "active") {
      return "Meeting link active";
    }

    return humanizeStatus(booking.zoom_status || booking.booking_status);
  };

  const canJoinMeeting = (booking) => ["active", "updated"].includes(booking.zoom_status) && Boolean(booking.zoom_link);

  const getZoomMessage = (booking) => {
    if (booking.booking_status === "pending") {
      return "Your booking is pending admin approval. Meeting details will appear once approved.";
    }

    if (booking.booking_status === "rejected") {
      return booking.notes || booking.zoom_message || booking.reason || "Your booking request was rejected by admin.";
    }

    if (booking.booking_status === "cancelled") {
      return booking.notes || booking.zoom_message || "This booking has been cancelled.";
    }

    if (booking.zoom_status === "updated") {
      return booking.zoom_message || "Meeting details were updated. Use the latest join URL below.";
    }

    if (booking.zoom_status === "unavailable") {
      return booking.zoom_message || "Meeting link is temporarily unavailable. Please check again shortly.";
    }

    if (booking.zoom_status === "expired") {
      return booking.zoom_message || "Meeting completed or link has expired.";
    }

    if (booking.zoom_status === "active") {
      return booking.zoom_message || "Your meeting link is active. Join using the URL below.";
    }

    return booking.zoom_message || "Meeting details are being processed.";
  };

  const handleLogout = async () => {
    await logout();
    toast.info("You have been signed out.");
    navigate("/", { replace: true });
  };

  const handleCancel = async (bookingId) => {
    setCancellingId(bookingId);

    try {
      await apiClient.put(API_ENDPOINTS.bookings.cancel(bookingId), {}, { requiresAuth: true });
      toast.success("Booking cancelled successfully.");
      await loadBookings();
    } catch (requestError) {
      toast.error(formatApiError(requestError, "Unable to cancel booking."));
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <MainLayout>
      <section className="px-4 pb-8 pt-12 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[36px] border border-[#efe7dc] bg-white/80 p-6 shadow-[0_25px_80px_-35px_rgba(0,0,0,0.25)] backdrop-blur md:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[5px] text-[#8b6e63]">Member dashboard</p>
                <h1 className="mt-3 text-4xl text-[#243224]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  Welcome back, {user?.first_name || "member"}.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f665f]">
                  Track your booking approvals, view upcoming circle schedules, and access your meeting link only when a booking is approved.
                </p>
              </div>

              <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full border border-[#e3d7ca] px-5 py-3 text-sm font-semibold text-[#314131]">
                <LogOut size={16} /> Logout
              </button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ["Total bookings", bookingSummary.total],
                ["Approved", bookingSummary.approved],
                ["Pending", bookingSummary.pending],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[26px] bg-[#fcf7f1] p-5">
                  <p className="text-sm text-[#6a746a]">{label}</p>
                  <p className="mt-3 text-3xl font-semibold text-[#314131]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-4">
              {isLoading ? <LoadingState label="Loading your bookings..." /> : null}
              {!isLoading && error ? <ErrorState message={error} onRetry={loadBookings} /> : null}

              {!isLoading && !error && !bookings.length ? (
                <div className="rounded-[30px] border border-dashed border-[#ddcfbf] bg-[#fcf7f1] p-8 text-center text-[#6b716d]">
                  <p>You have not booked a circle yet.</p>
                  <Link to="/circles" className="mt-4 inline-flex rounded-full bg-[#314131] px-5 py-3 text-sm font-semibold text-white">
                    Browse upcoming circles
                  </Link>
                </div>
              ) : null}

              {!isLoading && !error && bookings.map((booking) => (
                <article key={booking.id} className="rounded-[30px] border border-[#efe7dc] bg-white p-6 shadow-[0_18px_60px_-35px_rgba(0,0,0,0.25)]">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-semibold text-[#243224]">{booking.circle_title}</h2>
                        <StatusBadge status={booking.status} />
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[#5f665f]">
                        {formatDisplayDate(booking.meeting_date)} | {formatTimeRange(booking.start_time, booking.end_time)}
                      </p>
                    </div>

                    {(booking.booking_status === "pending" || booking.booking_status === "approved") ? (
                      <button
                        type="button"
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="rounded-full border border-[#e5d8cc] px-4 py-2 text-sm font-semibold text-[#314131] disabled:opacity-70"
                      >
                        {cancellingId === booking.id ? "Cancelling..." : "Cancel booking"}
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-5 rounded-[24px] bg-[#fcf7f1] p-5 text-sm text-[#314131]">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={booking.booking_status} />
                      <StatusBadge status={booking.zoom_status} />
                    </div>

                    <p className="mt-3 font-semibold">{getZoomStateLabel(booking)}</p>
                    <p className="mt-1 text-[#667066]">{getZoomMessage(booking)}</p>

                    {booking.booking_status === "approved" ? (
                      <div className="mt-4 space-y-3 rounded-[18px] border border-[#eadfce] bg-white/80 p-4">
                        <div className="grid gap-2 text-xs text-[#5f665f] sm:grid-cols-2">
                          <p>
                            <span className="font-semibold text-[#314131]">Join URL:</span>{" "}
                            {booking.zoom_link ? "Available" : "Not available"}
                          </p>
                          <p>
                            <span className="font-semibold text-[#314131]">Meeting ID:</span>{" "}
                            {booking.zoom_meeting_id || "-"}
                          </p>
                          <p>
                            <span className="font-semibold text-[#314131]">Zoom start time:</span>{" "}
                            {booking.zoom_start_time || "-"}
                          </p>
                          <p>
                            <span className="font-semibold text-[#314131]">Duration:</span>{" "}
                            {booking.zoom_duration ? `${booking.zoom_duration} min` : "-"}
                          </p>
                          <p>
                            <span className="font-semibold text-[#314131]">Approved at:</span>{" "}
                            {formatDisplayDate(booking.approved_at)}
                          </p>
                          <p>
                            <span className="font-semibold text-[#314131]">Meeting passcode:</span>{" "}
                            {booking.zoom_password || "Not required"}
                          </p>
                        </div>

                        {canJoinMeeting(booking) ? (
                          <a
                            href={booking.zoom_link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#314131] px-5 py-3 font-semibold text-white"
                          >
                            <LinkIcon size={16} /> Join with this URL
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>

            <aside className="rounded-[32px] border border-[#efe7dc] bg-white p-6 shadow-[0_18px_60px_-35px_rgba(0,0,0,0.25)]">
              <p className="text-sm uppercase tracking-[5px] text-[#8b6e63]">Quick access</p>
              <h2 className="mt-3 text-3xl text-[#243224]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Keep your circle plans moving.
              </h2>
              <div className="mt-6 space-y-4">
                <Link to="/circles" className="flex items-center gap-3 rounded-[24px] bg-[#fcf7f1] p-4 transition hover:bg-[#f7efe6]">
                  <CalendarDays size={18} className="text-[#8b6e63]" />
                  <div>
                    <p className="font-semibold text-[#314131]">Upcoming circles</p>
                    <p className="text-sm text-[#667066]">Book new sessions using the live public circles endpoint.</p>
                  </div>
                </Link>
                <div className="rounded-[24px] bg-[#fcf7f1] p-4">
                  <p className="font-semibold text-[#314131]">Approval policy</p>
                  <p className="mt-2 text-sm leading-7 text-[#667066]">Meeting links stay hidden until the booking status becomes approved.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <Footer />
    </MainLayout>
  );
}
