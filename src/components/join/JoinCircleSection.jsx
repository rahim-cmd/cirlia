import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { API_ENDPOINTS } from "../../config/api";
import { apiClient } from "../../lib/apiClient";
import { extractList, formatApiError } from "../../utils/apiResponse";
import { normalizeBooking, normalizeCircle } from "../../utils/entities";
import { formatDisplayDate, formatTimeRange, humanizeStatus } from "../../utils/formatters";

export default function JoinCircleSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joiningId, setJoiningId] = useState(null);
  const [bookings, setBookings] = useState([]);

  const applySeatDelta = useCallback((circleId, delta) => {
    if (!circleId || !delta) {
      return;
    }

    setCircles((current) =>
      current.map((circle) => {
        if (String(circle.id) !== String(circleId)) {
          return circle;
        }

        const nextBookedMembers = Math.max(0, Math.min(circle.max_members || Number.MAX_SAFE_INTEGER, Number(circle.booked_members || 0) + delta));

        return {
          ...circle,
          booked_members: nextBookedMembers,
        };
      })
    );
  }, []);

  const loadCircles = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
      setError("");
    }

    try {
      const circlesPayload = await apiClient.get(API_ENDPOINTS.circles.upcoming);
      setCircles(extractList(circlesPayload).map(normalizeCircle));

      if (isAuthenticated) {
        const bookingsPayload = await apiClient.get(API_ENDPOINTS.bookings.mine, { requiresAuth: true });
        setBookings(extractList(bookingsPayload).map(normalizeBooking));
      } else {
        setBookings([]);
      }

      if (!silent) {
        setError("");
      }
    } catch (requestError) {
      if (!silent) {
        setError(formatApiError(requestError, "Unable to load circles."));
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let ignore = false;

    const loadInitialCircles = async () => {
      try {
        const circlesPayload = await apiClient.get(API_ENDPOINTS.circles.upcoming);

        if (ignore) {
          return;
        }

        setCircles(extractList(circlesPayload).map(normalizeCircle));

        if (isAuthenticated) {
          const bookingsPayload = await apiClient.get(API_ENDPOINTS.bookings.mine, { requiresAuth: true });

          if (!ignore) {
            setBookings(extractList(bookingsPayload).map(normalizeBooking));
          }
        } else {
          setBookings([]);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(formatApiError(requestError, "Unable to load circles."));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadInitialCircles();

    const refreshCircles = () => {
      if (!ignore && document.visibilityState === "visible") {
        loadCircles({ silent: true });
      }
    };

    const handleBookingChange = (event) => {
      const circleId = event?.detail?.circleId;
      const delta = Number(event?.detail?.delta || 0);

      if (!ignore && circleId && delta) {
        applySeatDelta(circleId, delta);
      }

      if (!ignore && document.visibilityState === "visible") {
        loadCircles({ silent: true });
      }
    };

    const intervalId = window.setInterval(() => {
      if (!ignore && document.visibilityState === "visible") {
        loadCircles({ silent: true });
      }
    }, 30000);

    window.addEventListener("focus", refreshCircles);
    document.addEventListener("visibilitychange", refreshCircles);
    window.addEventListener("circlia:bookings-changed", handleBookingChange);

    return () => {
      ignore = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshCircles);
      document.removeEventListener("visibilitychange", refreshCircles);
      window.removeEventListener("circlia:bookings-changed", handleBookingChange);
    };
  }, [applySeatDelta, isAuthenticated, loadCircles]);

  const bookingsByCircleId = useMemo(() => {
    return bookings.reduce((accumulator, booking) => {
      if (booking.circle_id) {
        accumulator[booking.circle_id] = booking;
      }

      return accumulator;
    }, {});
  }, [bookings]);

  const handleJoin = async (circleId) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location }, replace: false });
      return;
    }

    try {
      setJoiningId(circleId);
      await apiClient.post(API_ENDPOINTS.bookings.create, { circle_id: circleId }, { requiresAuth: true });
      applySeatDelta(circleId, 1);
      toast.success("Booking request submitted successfully.");
      await loadCircles();
      window.dispatchEvent(new CustomEvent("circlia:bookings-changed", { detail: { circleId, delta: 1 } }));
    } catch (requestError) {
      toast.error(formatApiError(requestError, "Unable to place booking request."));
    } finally {
      setJoiningId(null);
    }
  };

  if (loading) {
    return <div className="py-40 text-center text-[#314131]">Loading circles...</div>;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <div className="rounded-[30px] border border-[#efc6b8] bg-[#fff4f1] p-8 text-center text-[#8f3e27]">
          <p>{error}</p>
          <button type="button" onClick={loadCircles} className="mt-4 rounded-full bg-[#314131] px-5 py-3 font-semibold text-white">
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="mt-16 text-center text-3xl font-bold sm:mt-24 md:mt-20">CIRCLE INFORMATION</h1>

      <p className="mx-auto mt-4 max-w-3xl px-4 text-center text-sm text-gray-600">
        Explore upcoming circles, request your place, and track whether your booking is pending, approved, rejected, or cancelled.
      </p>

      <div className="grid gap-8 px-4 py-8 md:grid-cols-2 xl:grid-cols-3">
        {circles.map((circle) => {
          const existingBooking = bookingsByCircleId[circle.id];
          const isBlocked = existingBooking && ["pending", "approved"].includes(existingBooking.status);
          const isBusy = joiningId === circle.id || isBlocked;

          return (
            <div key={circle.id || circle.title} className="mb-7 mt-4 w-full rounded-[30px] bg-white/70 p-8 shadow-xl sm:mx-4">
              <h2 className="text-2xl font-semibold text-[#314131]">{circle.title}</h2>
              <p className="mt-4 text-sm leading-7 text-gray-600">{circle.description}</p>

              <div className="mt-6 space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-semibold text-[#7A8E7B]">Date:</span> {formatDisplayDate(circle.meeting_date)}
                </p>
                <p>
                  <span className="font-semibold text-[#7A8E7B]">Time:</span> {formatTimeRange(circle.start_time, circle.end_time)}
                </p>
                <p>
                  <span className="font-semibold text-[#7A8E7B]">Host:</span> {circle.host_name}
                </p>
                <p>
                  <span className="font-semibold text-[#7A8E7B]">Seats:</span> {circle.booked_members}/{circle.max_members}
                </p>
              </div>

              {existingBooking ? (
                <div className="mt-5 rounded-[22px] bg-[#fcf7f1] p-4 text-sm text-[#314131]">
                  <p className="font-semibold">Current booking: {humanizeStatus(existingBooking.status)}</p>
                  <p className="mt-1 text-[#667066]">
                    {existingBooking.status === "approved"
                      ? "This booking is approved. Visit your dashboard for the meeting link."
                      : existingBooking.status === "pending"
                      ? "This request is waiting for admin approval."
                      : "You can submit a new request for this circle if needed."}
                  </p>
                </div>
              ) : null}

              <div className="mt-8 flex justify-center">
                <Button onClick={() => handleJoin(circle.id)} disabled={isBusy} className="mt-2 min-w-[180px]">
                  {joiningId === circle.id ? "Joining..." : isBlocked ? humanizeStatus(existingBooking?.status) : "Join Circle"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {!circles.length ? (
        <div className="px-4 pb-12">
          <div className="rounded-[30px] border border-dashed border-[#ddcfbf] bg-[#fcf7f1] p-10 text-center text-[#6b716d]">
            No upcoming circles are available right now.
          </div>
        </div>
      ) : null}
    </>
  );
}
