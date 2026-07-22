import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Filter, MessageSquare, XCircle } from "lucide-react";
import AdminShell from "../components/admin/AdminShell";
import DataTable from "../components/ui/DataTable";
import Modal from "../components/ui/Modal";
import StatusBadge from "../components/ui/StatusBadge";
import { ErrorState, LoadingState } from "../components/ui/LoadingState";
import { useToast } from "../context/ToastContext";
import { reviewsApi } from "../lib/reviewsApi";
import { formatApiError } from "../utils/apiResponse";
import { formatDisplayDate } from "../utils/formatters";

const moderationActions = {
  approved: {
    title: "Approve review",
    label: "Approve",
    buttonClass: "bg-[#314131]",
    notePlaceholder: "Looks good for homepage.",
    successMessage: "Review approved successfully.",
  },
  rejected: {
    title: "Reject review",
    label: "Reject",
    buttonClass: "bg-[#a44d31]",
    notePlaceholder: "Reason for rejection",
    successMessage: "Review rejected successfully.",
  },
};

const renderStars = (rating) => {
  const safeRating = Math.max(0, Math.min(5, Number(rating || 0)));

  return Array.from({ length: 5 }, (_, index) => {
    const active = index < safeRating;

    return (
      <span
        key={`admin-review-star-${index}`}
        className={`text-sm ${active ? "text-[#f0a63b]" : "text-[#d7c7ad]"}`}
      >
        ★
      </span>
    );
  });
};

export default function AdminReviews() {
  const toast = useToast();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [limit, setLimit] = useState(50);
  const [circleIdFilter, setCircleIdFilter] = useState("");
  const [moderationState, setModerationState] = useState({
    open: false,
    review: null,
    status: "approved",
    note: "",
  });
  const [isModerating, setIsModerating] = useState(false);

  const loadReviews = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await reviewsApi.getAdminReviews({
        status: statusFilter,
        limit,
        circleId: circleIdFilter.trim() || undefined,
      });

      setReviews(data);
      setError("");
    } catch (requestError) {
      if (requestError?.status === 401) {
        setError("Your admin session expired. Please sign in again.");
      } else if (requestError?.status === 403) {
        setError("You are not allowed to moderate reviews.");
      } else {
        setError(formatApiError(requestError, "Unable to load review moderation queue."));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadInitialReviews = async () => {
      try {
        const data = await reviewsApi.getAdminReviews({
          status: statusFilter,
          limit,
          circleId: circleIdFilter.trim() || undefined,
        });

        if (!ignore) {
          setReviews(data);
          setError("");
        }
      } catch (requestError) {
        if (!ignore) {
          if (requestError?.status === 401) {
            setError("Your admin session expired. Please sign in again.");
          } else if (requestError?.status === 403) {
            setError("You are not allowed to moderate reviews.");
          } else {
            setError(formatApiError(requestError, "Unable to load review moderation queue."));
          }
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadInitialReviews();

    return () => {
      ignore = true;
    };
  }, [statusFilter, limit, circleIdFilter]);

  const openModerationModal = (review, status) => {
    const action = moderationActions[status];

    setModerationState({
      open: true,
      review,
      status,
      note: action?.notePlaceholder || "",
    });
  };

  const closeModerationModal = () => {
    setModerationState({ open: false, review: null, status: "approved", note: "" });
  };

  const submitModeration = async () => {
    const targetReview = moderationState.review;

    if (!targetReview?.id) {
      return;
    }

    setIsModerating(true);

    try {
      const updated = await reviewsApi.moderateReview(targetReview.id, {
        status: moderationState.status,
        note: moderationState.note,
      });

      setReviews((current) => {
        if (statusFilter === "pending") {
          return current.filter((item) => item.id !== targetReview.id);
        }

        return current.map((item) => (item.id === targetReview.id ? { ...item, ...updated } : item));
      });

      window.dispatchEvent(new CustomEvent("circlia:reviews-changed"));

      toast.success(moderationActions[moderationState.status]?.successMessage || "Review status updated.");
      closeModerationModal();
    } catch (requestError) {
      if (requestError?.status === 401) {
        toast.error("Your admin session expired. Please sign in again.");
      } else if (requestError?.status === 403) {
        toast.error("You are not allowed to moderate reviews.");
      } else if (requestError?.status === 422) {
        toast.error(formatApiError(requestError, "Invalid moderation request."));
      } else if (requestError?.status === 404) {
        toast.error("Review not found.");
      } else {
        toast.error(formatApiError(requestError, "Unable to update review status."));
      }
    } finally {
      setIsModerating(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "member",
        label: "Member",
        render: (review) => (
          <div>
            <p className="font-semibold text-[#2f3f2f]">{review.reviewer_name || "Member"}</p>
            <p className="mt-1 text-xs text-[#6b716d]">{review.email || "No email"}</p>
          </div>
        ),
      },
      {
        key: "circle",
        label: "Circle",
        render: (review) => (
          <div>
            <p className="font-semibold">{review.circle_title || "Untitled circle"}</p>
            <p className="mt-1 text-xs text-[#6b716d]">{formatDisplayDate(review.meeting_date)}</p>
          </div>
        ),
      },
      {
        key: "review",
        label: "Review",
        render: (review) => (
          <div>
            <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
            <p className="mt-2 max-w-xs text-sm leading-6 text-[#4f584f]">{review.review_text || "-"}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusBadge status={review.is_public ? "public" : "private"} />
            </div>
          </div>
        ),
      },
      {
        key: "status",
        label: "Status",
        render: (review) => (
          <div className="space-y-1">
            <StatusBadge status={review.review_status} />
            {review.review_status === "pending" ? (
              <p className="text-xs text-[#8b6e63]">Awaiting moderation</p>
            ) : null}
          </div>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (review) => (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openModerationModal(review, "approved")}
              disabled={isModerating}
              className="inline-flex items-center gap-2 rounded-full bg-[#314131] px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CheckCircle2 size={14} /> Approve
            </button>
            <button
              type="button"
              onClick={() => openModerationModal(review, "rejected")}
              disabled={isModerating}
              className="inline-flex items-center gap-2 rounded-full bg-[#a44d31] px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <XCircle size={14} /> Reject
            </button>
          </div>
        ),
      },
    ],
    [isModerating]
  );

  const filteredReviews = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return reviews;
    }

    return reviews.filter((review) =>
      [
        review.reviewer_name,
        review.first_name,
        review.last_name,
        review.email,
        review.circle_title,
        review.review_text,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [reviews, searchQuery]);

  return (
    <AdminShell title="Moderate member reviews" subtitle="Approve or reject user reviews before they appear on homepage testimonials.">
      <div className="grid gap-4 rounded-[24px] border border-[#efe7dc] bg-white p-4 sm:rounded-[28px] sm:p-5 md:grid-cols-4">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[2px] text-[#8b6e63]">Status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-2xl border border-[#e3d7ca] bg-[#fcf7f1] px-4 py-3 text-sm outline-none"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[2px] text-[#8b6e63]">Circle ID (optional)</span>
          <input
            value={circleIdFilter}
            onChange={(event) => setCircleIdFilter(event.target.value)}
            placeholder="e.g. 10"
            className="w-full rounded-2xl border border-[#e3d7ca] bg-[#fcf7f1] px-4 py-3 text-sm outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[2px] text-[#8b6e63]">Limit</span>
          <select
            value={limit}
            onChange={(event) => setLimit(Number(event.target.value))}
            className="w-full rounded-2xl border border-[#e3d7ca] bg-[#fcf7f1] px-4 py-3 text-sm outline-none"
          >
            {[25, 50, 100, 200].map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[2px] text-[#8b6e63]">Search</span>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by reviewer, email, circle, or review text"
            className="w-full rounded-2xl border border-[#e3d7ca] bg-[#fcf7f1] px-4 py-3 text-sm outline-none"
          />
        </label>

        <button
          type="button"
          onClick={loadReviews}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e3d7ca] px-4 py-2 text-sm font-semibold text-[#314131]"
        >
          <Filter size={14} /> Refresh queue
        </button>
      </div>

      {isLoading ? <LoadingState label="Loading moderation queue..." /> : null}
      {!isLoading && error ? <ErrorState message={error} onRetry={loadReviews} /> : null}
      {!isLoading && !error ? <DataTable columns={columns} rows={filteredReviews} emptyMessage="No reviews found for selected filters/search." /> : null}

      <Modal
        open={moderationState.open}
        onClose={closeModerationModal}
        title={moderationActions[moderationState.status]?.title || "Moderate review"}
        description={moderationState.review ? `${moderationState.review.reviewer_name} • ${moderationState.review.circle_title}` : ""}
        footer={[
          <button
            key="cancel"
            type="button"
            onClick={closeModerationModal}
            className="rounded-full border border-[#ded3c7] px-5 py-3 text-sm font-semibold text-[#314131]"
          >
            Cancel
          </button>,
          <button
            key="confirm"
            type="button"
            onClick={submitModeration}
            disabled={isModerating}
            className={`${moderationActions[moderationState.status]?.buttonClass || "bg-[#314131]"} rounded-full px-5 py-3 text-sm font-semibold text-white disabled:opacity-60`}
          >
            {isModerating ? "Saving..." : moderationActions[moderationState.status]?.label || "Save"}
          </button>,
        ]}
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#e7ddcf] bg-[#fcf7f1] p-4">
            <div className="flex items-center gap-1">{renderStars(moderationState.review?.rating)}</div>
            <p className="mt-2 text-sm leading-7 text-[#4f584f]">{moderationState.review?.review_text}</p>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#314131]">Moderation note</span>
            <textarea
              rows={3}
              value={moderationState.note}
              onChange={(event) => setModerationState((current) => ({ ...current, note: event.target.value }))}
              className="w-full rounded-2xl border border-[#e3d7ca] bg-[#fcf7f1] px-4 py-3 text-sm outline-none"
              placeholder={moderationActions[moderationState.status]?.notePlaceholder || "Add note"}
            />
          </label>

          <p className="text-xs text-[#6b716d]">
            Approved public reviews only appear on homepage testimonials.
          </p>
        </div>
      </Modal>

      <div className="rounded-[24px] border border-[#efe7dc] bg-white p-4 sm:rounded-[28px] sm:p-5">
        <div className="flex items-center gap-2 text-[#314131]">
          <MessageSquare size={16} />
          <p className="text-sm font-semibold">API quick refs</p>
        </div>
        <div className="mt-3 space-y-1 text-xs text-[#6a746a]">
          <p>GET /api/v1/reviews/admin?status=pending&limit=50&circle_id=10</p>
          <p>PUT /api/v1/reviews/:id/moderation</p>
          <p>GET /api/v1/reviews/homepage?limit=12</p>
        </div>
      </div>
    </AdminShell>
  );
}
