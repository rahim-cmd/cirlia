import { API_ENDPOINTS } from "../config/api";
import { apiClient } from "./apiClient";
import { extractItem, extractList } from "../utils/apiResponse";

const extractReviewsCollection = (payload) => {
  const directList = extractList(payload);

  if (directList.length) {
    return directList;
  }

  const data = extractItem(payload);
  const candidates = [
    data?.reviews,
    data?.rows,
    data?.items,
    payload?.reviews,
    payload?.rows,
    payload?.items,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
};

const normalizeReview = (review = {}) => ({
  id: review.id || review.review_id || review._id || null,
  booking_id: review.booking_id || review.bookingId || null,
  circle_id: review.circle_id || review.circleId || null,
  user_id: review.user_id || review.userId || null,
  rating: Number(review.rating || 0),
  review_text: review.review_text || review.reviewText || "",
  is_public: Boolean(review.is_public ?? review.isPublic),
  review_status: String(review.review_status || review.reviewStatus || "pending").toLowerCase(),
  moderation_note: review.moderation_note || review.moderationNote || null,
  moderated_by_admin_id: review.moderated_by_admin_id || review.moderatedByAdminId || null,
  moderated_at: review.moderated_at || review.moderatedAt || null,
  first_name: review.first_name || review.firstName || "",
  last_name: review.last_name || review.lastName || "",
  email: review.email || "",
  reviewer_name: review.reviewer_name || review.reviewerName || review.user_name || review.userName || "Member",
  circle_title: review.circle_title || review.circleTitle || "",
  meeting_date: review.meeting_date || review.meetingDate || "",
  start_time: review.start_time || review.startTime || "",
  end_time: review.end_time || review.endTime || "",
  created_at: review.created_at || review.createdAt || "",
  updated_at: review.updated_at || review.updatedAt || "",
});

export const reviewsApi = {
  async upsertBookingReview(bookingId, body) {
    const payload = await apiClient.post(API_ENDPOINTS.reviews.upsertByBooking(bookingId), body, {
      requiresAuth: true,
    });

    return normalizeReview(extractItem(payload));
  },

  async getMyReviews() {
    const payload = await apiClient.get(API_ENDPOINTS.reviews.mine, { requiresAuth: true });
    return extractReviewsCollection(payload).map(normalizeReview);
  },

  async getHomepageReviews(limit = 12, circleId) {
    const params = new URLSearchParams();

    if (limit) {
      params.set("limit", String(limit));
    }

    if (circleId) {
      params.set("circle_id", String(circleId));
    }

    const query = params.toString();
    const path = query ? `${API_ENDPOINTS.reviews.homepage}?${query}` : API_ENDPOINTS.reviews.homepage;
    const payload = await apiClient.get(path);
    return extractReviewsCollection(payload).map(normalizeReview);
  },

  async getAdminReviews({ status = "pending", limit = 50, circleId } = {}) {
    const params = new URLSearchParams();

    if (["pending", "approved", "rejected"].includes(String(status).toLowerCase())) {
      params.set("status", String(status));
    }

    if (limit) {
      params.set("limit", String(limit));
    }

    if (circleId) {
      params.set("circle_id", String(circleId));
    }

    const query = params.toString();
    const path = query ? `${API_ENDPOINTS.reviews.admin}?${query}` : API_ENDPOINTS.reviews.admin;
    const payload = await apiClient.get(path, { requiresAuth: true });

    return extractReviewsCollection(payload).map(normalizeReview);
  },

  async moderateReview(reviewId, body) {
    const payload = await apiClient.put(API_ENDPOINTS.reviews.moderationById(reviewId), body, {
      requiresAuth: true,
    });

    return normalizeReview(extractItem(payload));
  },

  async deleteReview(reviewId) {
    return apiClient.delete(API_ENDPOINTS.reviews.byId(reviewId), { requiresAuth: true });
  },
};
