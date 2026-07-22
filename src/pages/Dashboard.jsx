import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, Link as LinkIcon, LogOut, Square, Star, Trash2 } from "lucide-react";
import MainLayout from "../layout/MainLayout";
import Footer from "../components/Footer";
import Modal from "../components/ui/Modal";
import StatusBadge from "../components/ui/StatusBadge";
import { ErrorState, LoadingState } from "../components/ui/LoadingState";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { API_ENDPOINTS } from "../config/api";
import { apiClient } from "../lib/apiClient";
import { reviewsApi } from "../lib/reviewsApi";
import { extractItem, extractList, formatApiError } from "../utils/apiResponse";
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
  const [joiningBookingId, setJoiningBookingId] = useState(null);
  const [endingBookingId, setEndingBookingId] = useState(null);
  const [reviewsByBooking, setReviewsByBooking] = useState({});
  const [reviewModal, setReviewModal] = useState({ open: false, booking: null });
  const [reviewForm, setReviewForm] = useState({ rating: 0, review_text: "", is_public: true });
  const [reviewFormError, setReviewFormError] = useState("");
  const [reviewFormLocked, setReviewFormLocked] = useState(false);
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [isDeletingReview, setIsDeletingReview] = useState(false);

  const redirectToLogin = useCallback(() => {
    toast.info("Please sign in again to continue.");
    navigate("/login", { replace: true });
  }, [navigate, toast]);

  const mapReviewsByBooking = (reviewList = []) => {
    return reviewList.reduce((accumulator, review) => {
      if (review?.booking_id) {
        accumulator[review.booking_id] = review;
      }

      return accumulator;
    }, {});
  };

  const loadDashboardData = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setIsLoading(true);
      setError("");
    }

    try {
      const [bookingsPayload, myReviews] = await Promise.all([
        apiClient.get(API_ENDPOINTS.bookings.mine, { requiresAuth: true }),
        reviewsApi.getMyReviews(),
      ]);

      setBookings(extractList(bookingsPayload).map(normalizeBooking));
      setReviewsByBooking(mapReviewsByBooking(myReviews));

      if (!silent) {
        setError("");
      }
    } catch (requestError) {
      if (requestError?.status === 401) {
        redirectToLogin();
        return;
      }

      if (!silent) {
        setError(formatApiError(requestError, "Unable to load your bookings."));
      }
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, [redirectToLogin]);

  useEffect(() => {
    let ignore = false;

    const loadInitialDashboardData = async () => {
      try {
        const [bookingsPayload, myReviews] = await Promise.all([
          apiClient.get(API_ENDPOINTS.bookings.mine, { requiresAuth: true }),
          reviewsApi.getMyReviews(),
        ]);

        if (!ignore) {
          setBookings(extractList(bookingsPayload).map(normalizeBooking));
          setReviewsByBooking(mapReviewsByBooking(myReviews));
        }
      } catch (requestError) {
        if (!ignore && requestError?.status === 401) {
          redirectToLogin();
          return;
        }

        if (!ignore) {
          setError(formatApiError(requestError, "Unable to load your bookings."));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    const loadDashboardDataSilently = async () => {
      try {
        const [bookingsPayload, myReviews] = await Promise.all([
          apiClient.get(API_ENDPOINTS.bookings.mine, { requiresAuth: true }),
          reviewsApi.getMyReviews(),
        ]);

        if (!ignore) {
          setBookings(extractList(bookingsPayload).map(normalizeBooking));
          setReviewsByBooking(mapReviewsByBooking(myReviews));
        }
      } catch {
        // Keep existing dashboard state if silent refresh fails.
      }
    };

    loadInitialDashboardData();

    const refreshOnFocus = () => {
      if (!ignore && document.visibilityState === "visible") {
        loadDashboardDataSilently();
      }
    };

    const refreshOnBookingChange = () => {
      if (!ignore) {
        loadDashboardDataSilently();
      }
    };

    const intervalId = window.setInterval(() => {
      if (!ignore && document.visibilityState === "visible") {
        loadDashboardDataSilently();
      }
    }, 30000);

    window.addEventListener("focus", refreshOnFocus);
    document.addEventListener("visibilitychange", refreshOnFocus);
    window.addEventListener("circlia:bookings-changed", refreshOnBookingChange);

    return () => {
      ignore = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshOnFocus);
      document.removeEventListener("visibilitychange", refreshOnFocus);
      window.removeEventListener("circlia:bookings-changed", refreshOnBookingChange);
    };
  }, [redirectToLogin]);

  const bookingSummary = useMemo(
    () => ({
      total: bookings.length,
      approved: bookings.filter((booking) => booking.booking_status === "approved").length,
      pending: bookings.filter((booking) => booking.booking_status === "pending").length,
      reviewed: Object.keys(reviewsByBooking).length,
    }),
    [bookings, reviewsByBooking]
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

  const canJoinMeeting = (booking) => {
    if (booking.booking_status !== "approved") {
      return false;
    }

    if (!booking.zoom_link) {
      return false;
    }

    return booking.join_enabled === true;
  };

  const getJoinHelperText = (booking) => {
    if (booking.join_message) {
      return booking.join_message;
    }

    if (!booking.zoom_link) {
      return booking.zoom_message || "Join URL is not available yet.";
    }

    if (booking.join_enabled === false) {
      return booking.join_lock_reason || "Join access is disabled by admin.";
    }

    if (booking.join_lock_reason) {
      return booking.join_lock_reason;
    }

    return booking.join_message || "Join is available from your dashboard.";
  };

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
      const bookingToCancel = bookings.find((booking) => booking.id === bookingId);

      await apiClient.put(API_ENDPOINTS.bookings.cancel(bookingId), {}, { requiresAuth: true });
      toast.success("Booking cancelled successfully.");
      await loadDashboardData();
      window.dispatchEvent(
        new CustomEvent("circlia:bookings-changed", {
          detail: {
            circleId: bookingToCancel?.circle_id,
            delta: -1,
          },
        })
      );
    } catch (requestError) {
      if (requestError?.status === 401) {
        redirectToLogin();
        return;
      }

      toast.error(formatApiError(requestError, "Unable to cancel booking."));
    } finally {
      setCancellingId(null);
    }
  };

  const handleJoinStart = async (booking) => {
    if (!booking?.id) {
      return;
    }

    setJoiningBookingId(booking.id);

    try {
      const payload = await apiClient.post(API_ENDPOINTS.bookings.joinStart(booking.id), {}, { requiresAuth: true });
      const responseData = extractItem(payload);
      const responseZoomLink =
        responseData?.zoom_link || responseData?.zoomLink || responseData?.join_url || responseData?.joinUrl || booking.zoom_link;

      toast.success("Meeting access granted. Opening Zoom...");
      await loadDashboardData({ silent: true });

      if (responseZoomLink) {
        window.open(responseZoomLink, "_blank", "noopener,noreferrer");
      }
    } catch (requestError) {
      if (requestError?.status === 401) {
        redirectToLogin();
        return;
      }

      toast.error(formatApiError(requestError, "Unable to start join session."));
    } finally {
      setJoiningBookingId(null);
    }
  };

  const handleJoinEnd = async (booking) => {
    if (!booking?.id) {
      return;
    }

    setEndingBookingId(booking.id);

    try {
      await apiClient.post(API_ENDPOINTS.bookings.joinEnd(booking.id), {}, { requiresAuth: true });
      toast.success("Session ended successfully.");
      await loadDashboardData({ silent: true });
    } catch (requestError) {
      if (requestError?.status === 401) {
        redirectToLogin();
        return;
      }

      toast.error(formatApiError(requestError, "Unable to end session."));
    } finally {
      setEndingBookingId(null);
    }
  };

  const openReviewModal = (booking) => {
    const existingReview = reviewsByBooking[booking.id];

    setReviewModal({ open: true, booking });
    setReviewForm({
      rating: Number(existingReview?.rating || 0),
      review_text: existingReview?.review_text || "",
      is_public: existingReview?.is_public ?? true,
    });
    setReviewFormError("");
    setReviewFormLocked(false);
  };

  const closeReviewModal = () => {
    setReviewModal({ open: false, booking: null });
    setReviewForm({ rating: 0, review_text: "", is_public: true });
    setReviewFormError("");
    setReviewFormLocked(false);
  };

  const getExistingReview = () => {
    if (!reviewModal.booking?.id) {
      return null;
    }

    return reviewsByBooking[reviewModal.booking.id] || null;
  };

  const handleReviewSubmit = async () => {
    const bookingId = reviewModal.booking?.id;

    if (!bookingId || reviewFormLocked) {
      return;
    }

    setIsSavingReview(true);
    setReviewFormError("");

    try {
      const saved = await reviewsApi.upsertBookingReview(bookingId, {
        rating: Number(reviewForm.rating),
        review_text: reviewForm.review_text,
        is_public: Boolean(reviewForm.is_public),
      });

      setReviewsByBooking((current) => ({
        ...current,
        [bookingId]: saved,
      }));

      window.dispatchEvent(new CustomEvent("circlia:reviews-changed"));

      toast.success(getExistingReview() ? "Review updated successfully." : "Review submitted successfully.");
      closeReviewModal();
    } catch (requestError) {
      if (requestError?.status === 401) {
        redirectToLogin();
        return;
      }

      if (requestError?.status === 422) {
        setReviewFormError(formatApiError(requestError, "You are not eligible to review this meeting yet."));
        setReviewFormLocked(true);
        return;
      }

      if (requestError?.status === 404) {
        setReviewFormError("Booking/review not found.");
        setReviewFormLocked(true);
        return;
      }

      if (requestError?.status >= 500) {
        setReviewFormError("Something went wrong. Please try again.");
        return;
      }

      setReviewFormError(formatApiError(requestError, "Unable to save your review."));
    } finally {
      setIsSavingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    const existingReview = getExistingReview();

    if (!existingReview?.id) {
      return;
    }

    setIsDeletingReview(true);
    setReviewFormError("");

    try {
      await reviewsApi.deleteReview(existingReview.id);

      setReviewsByBooking((current) => {
        const next = { ...current };
        delete next[reviewModal.booking.id];
        return next;
      });

      window.dispatchEvent(new CustomEvent("circlia:reviews-changed"));

      toast.success("Review deleted successfully.");
      closeReviewModal();
    } catch (requestError) {
      if (requestError?.status === 401) {
        redirectToLogin();
        return;
      }

      if (requestError?.status === 404) {
        setReviewFormError("Booking/review not found.");
        return;
      }

      if (requestError?.status >= 500) {
        setReviewFormError("Something went wrong. Please try again.");
        return;
      }

      setReviewFormError(formatApiError(requestError, "Unable to delete review."));
    } finally {
      setIsDeletingReview(false);
    }
  };

  const reviewForActiveModal = getExistingReview();

  const renderStars = (rating) => {
    const safeRating = Math.max(0, Math.min(5, Number(rating || 0)));

    return Array.from({ length: 5 }, (_, index) => {
      const active = index < safeRating;

      return (
        <Star
          key={`rating-star-${index}`}
          size={16}
          className={active ? "fill-[#f0a63b] text-[#f0a63b]" : "text-[#d7c7ad]"}
        />
      );
    });
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

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {[
                ["Total bookings", bookingSummary.total],
                ["Approved", bookingSummary.approved],
                ["Pending", bookingSummary.pending],
                ["Reviewed", bookingSummary.reviewed],
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
              {!isLoading && error ? <ErrorState message={error} onRetry={loadDashboardData} /> : null}

              {!isLoading && !error && !bookings.length ? (
                <div className="rounded-[30px] border border-dashed border-[#ddcfbf] bg-[#fcf7f1] p-8 text-center text-[#6b716d]">
                  <p>You have not booked a circle yet.</p>
                  <Link to="/circles" className="mt-4 inline-flex rounded-full bg-[#314131] px-5 py-3 text-sm font-semibold text-white">
                    Browse upcoming circles
                  </Link>
                </div>
              ) : null}

              {!isLoading && !error && bookings.map((booking) => {
                const existingReview = reviewsByBooking[booking.id] || null;

                return (
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

                        <div className="space-y-2">
                          <p className="text-xs text-[#667066]">{getJoinHelperText(booking)}</p>
                          {booking.join_locked_at ? (
                            <p className="text-xs text-[#8b6e63]">Join locked at: {formatDisplayDate(booking.join_locked_at)}</p>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            disabled={!canJoinMeeting(booking) || joiningBookingId === booking.id}
                            onClick={() => handleJoinStart(booking)}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#314131] px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <LinkIcon size={16} /> {joiningBookingId === booking.id ? "Starting..." : "Join Meeting"}
                          </button>

                          <button
                            type="button"
                            disabled={endingBookingId === booking.id}
                            onClick={() => handleJoinEnd(booking)}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e3d7ca] px-5 py-3 font-semibold text-[#314131] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Square size={14} /> {endingBookingId === booking.id ? "Ending..." : "End Session"}
                          </button>

                          <button
                            type="button"
                            onClick={() => openReviewModal(booking)}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e3d7ca] px-5 py-3 font-semibold text-[#314131]"
                          >
                            <Star size={14} className="text-[#f0a63b]" /> {existingReview ? "Edit review" : "Rate this meeting"}
                          </button>
                        </div>

                        {existingReview ? (
                          <div className="rounded-[16px] border border-[#ebdfcf] bg-[#fffaf2] p-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-xs uppercase tracking-[3px] text-[#8b6e63]">Your review</p>
                              <div className="flex flex-wrap items-center justify-end gap-2">
                                <StatusBadge status={existingReview.review_status || "pending"} />
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#5f665f]">
                                  {existingReview.is_public ? "Public enabled" : "Private"}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center gap-1">{renderStars(existingReview.rating)}</div>
                            <p className="mt-3 text-sm leading-7 text-[#4d564d]">{existingReview.review_text || "No comment added."}</p>
                            {existingReview.review_status === "pending" ? (
                              <p className="mt-2 text-xs text-[#8b6e63]">Waiting for admin approval.</p>
                            ) : null}
                            {existingReview.review_status === "rejected" ? (
                              <p className="mt-2 text-xs text-[#a44d31]">
                                {existingReview.moderation_note || "This review was rejected by admin."}
                              </p>
                            ) : null}
                            {existingReview.review_status === "approved" && existingReview.is_public ? (
                              <p className="mt-2 text-xs text-[#3d6a48]">Approved and visible on homepage.</p>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </article>
              )})}
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

      <Modal
        open={reviewModal.open}
        onClose={closeReviewModal}
        title={reviewForActiveModal ? "Edit your review" : "Rate this meeting"}
        description={
          reviewModal.booking
            ? `${reviewModal.booking.circle_title} on ${formatDisplayDate(reviewModal.booking.meeting_date)}`
            : ""
        }
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-[#314131]">Your rating</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {Array.from({ length: 5 }, (_, index) => {
                const score = index + 1;
                const active = score <= Number(reviewForm.rating || 0);

                return (
                  <button
                    key={`review-input-star-${score}`}
                    type="button"
                    disabled={reviewFormLocked || isSavingReview || isDeletingReview}
                    onClick={() => setReviewForm((current) => ({ ...current, rating: score }))}
                    className="rounded-full border border-[#eadfce] bg-white p-2 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label={`Rate ${score} stars`}
                  >
                    <Star size={18} className={active ? "fill-[#f0a63b] text-[#f0a63b]" : "text-[#c9b89f]"} />
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-[#314131]">Your review</span>
            <textarea
              rows={4}
              value={reviewForm.review_text}
              disabled={reviewFormLocked || isSavingReview || isDeletingReview}
              onChange={(event) => setReviewForm((current) => ({ ...current, review_text: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-[#e7ddcf] bg-white px-4 py-3 text-sm text-[#314131] outline-none transition focus:border-[#cfbea7] focus:ring-2 focus:ring-[#efe3d2] disabled:cursor-not-allowed disabled:bg-[#f7f3ec]"
              placeholder="How was your experience in this circle meeting?"
            />
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-[#eadfce] bg-[#fcf7f1] px-4 py-3">
            <input
              type="checkbox"
              checked={reviewForm.is_public}
              disabled={reviewFormLocked || isSavingReview || isDeletingReview}
              onChange={(event) => setReviewForm((current) => ({ ...current, is_public: event.target.checked }))}
              className="h-4 w-4 rounded border-[#ccb99d] text-[#314131]"
            />
            <span className="text-sm text-[#4f584f]">Show this review on homepage testimonials</span>
          </label>

          {reviewFormError ? <p className="text-sm text-[#a44d31]">{reviewFormError}</p> : null}

          <div className="flex flex-wrap justify-end gap-3">
            {reviewForActiveModal?.id ? (
              <button
                type="button"
                onClick={handleDeleteReview}
                disabled={isSavingReview || isDeletingReview}
                className="inline-flex items-center gap-2 rounded-full border border-[#e7c7bf] px-5 py-2 text-sm font-semibold text-[#a44d31] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={14} /> {isDeletingReview ? "Deleting..." : "Delete review"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={closeReviewModal}
              disabled={isSavingReview || isDeletingReview}
              className="rounded-full border border-[#e3d7ca] px-5 py-2 text-sm font-semibold text-[#314131] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReviewSubmit}
              disabled={
                reviewFormLocked ||
                isSavingReview ||
                isDeletingReview ||
                Number(reviewForm.rating) < 1 ||
                !String(reviewForm.review_text || "").trim()
              }
              className="rounded-full bg-[#314131] px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingReview ? "Saving..." : reviewForActiveModal ? "Update review" : "Submit review"}
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </MainLayout>
  );
}
