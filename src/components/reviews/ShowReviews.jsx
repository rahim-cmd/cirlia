import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { apiClient } from "../../lib/apiClient";
import { formatDisplayDate } from "../../utils/formatters";

const normalizeReview = (review = {}) => ({
	id: review.id || review.review_id || review._id || null,
	rating: Number(review.rating || 0),
	review_text: review.review_text || review.reviewText || "",
	reviewer_name: review.reviewer_name || review.reviewerName || review.user_name || "Member",
	circle_title: review.circle_title || review.circleTitle || "Circlia circle",
	meeting_date: review.meeting_date || review.meetingDate || "",
	created_at: review.created_at || review.createdAt || "",
	updated_at: review.updated_at || review.updatedAt || "",
});

const extractArray = (payload) => {
	if (Array.isArray(payload)) {
		return payload;
	}

	if (Array.isArray(payload?.data)) {
		return payload.data;
	}

	if (Array.isArray(payload?.data?.reviews)) {
		return payload.data.reviews;
	}

	if (Array.isArray(payload?.reviews)) {
		return payload.reviews;
	}

	return [];
};

const renderStars = (rating) => {
	const safeRating = Math.max(0, Math.min(5, Number(rating || 0)));

	return Array.from({ length: 5 }, (_, index) => {
		const active = index < safeRating;

		return (
			<Star
				key={`show-review-star-${index}`}
				size={14}
				className={active ? "fill-[#f0a63b] text-[#f0a63b]" : "text-[#d7c7ad]"}
			/>
		);
	});
};

export default function ShowReviews({ limit = 6, title = "What members say" }) {
	const [reviews, setReviews] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let ignore = false;

		const loadApprovedReviews = async () => {
			setIsLoading(true);
			setError("");

			try {
				const safeLimit = Math.max(1, Math.min(6, Number(limit) || 6));
				const payload = await apiClient.get(`/reviews/approved?limit=${safeLimit}`, { requiresAuth: true });
				const list = extractArray(payload)
					.map(normalizeReview)
					.filter((item) => item.rating > 0 && String(item.review_text || "").trim())
					.sort((left, right) => {
						const leftTime = new Date(left.updated_at || left.created_at || 0).getTime();
						const rightTime = new Date(right.updated_at || right.created_at || 0).getTime();
						return rightTime - leftTime;
					})
					.slice(0, safeLimit);

				if (!ignore) {
					setReviews(list);
				}
			} catch {
				if (!ignore) {
					setReviews([]);
					setError("Unable to load reviews right now.");
				}
			} finally {
				if (!ignore) {
					setIsLoading(false);
				}
			}
		};

		loadApprovedReviews();

		return () => {
			ignore = true;
		};
	}, [limit]);

	const hasReviews = useMemo(() => reviews.length > 0, [reviews]);

	if (isLoading) {
		return (
			<section className="px-4 py-14 md:px-8 lg:px-12">
				<div className="mx-auto max-w-7xl rounded-[28px] border border-[#e7ddcf] bg-[#fcf7f1] p-6 text-sm text-[#5f665f]">
					Loading approved reviews...
				</div>
			</section>
		);
	}

	if (error && !hasReviews) {
		return (
			<section className="px-4 py-14 md:px-8 lg:px-12">
				<div className="mx-auto max-w-7xl rounded-[28px] border border-[#efc6b8] bg-[#fff1ed] p-6 text-sm text-[#9d4327]">
					{error}
				</div>
			</section>
		);
	}

	if (!hasReviews) {
		return null;
	}

	return (
		<section className="relative overflow-hidden bg-[#faf4eb] px-4 py-14 md:px-8 lg:px-12 grid items-center justify-center">
			<div className="pointer-events-none absolute inset-0 opacity-50">
				<div className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-[#e7d8c3]/70 blur-2xl" />
				<div className="absolute -right-10 bottom-8 h-48 w-48 rounded-full bg-[#d3e3d3]/70 blur-3xl" />
			</div>

			<div className="relative mx-auto max-w-7xl ">
				<p className="text-sm uppercase tracking-[5px] text-[#8b6e63]">Testimonials</p>
				<h2 className="mt-3 text-4xl text-[#243224] md:text-5xl" style={{ fontFamily: "Cormorant Garamond, serif" }}>
					{title}
				</h2>
				<p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f665f]">
					Latest approved member reviews from recent circle meetings.
				</p>

				<div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{reviews.map((review) => (
						<article
							key={review.id || `${review.reviewer_name}-${review.created_at}`}
							className="rounded-[28px] border border-[#e7dccc] bg-white/95 p-5 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.4)]"
						>
							<div className="flex items-center gap-1">{renderStars(review.rating)}</div>

							<p className="mt-4 text-sm leading-7 text-[#3f4a3f]">"{review.review_text}"</p>

							<div className="mt-5 border-t border-[#efe4d4] pt-4">
								<p className="text-sm font-semibold text-[#2f3f2f]">{review.reviewer_name || "Member"}</p>
								<p className="mt-1 text-xs uppercase tracking-[2px] text-[#8b6e63]">{review.circle_title || "Circlia circle"}</p>
								<p className="mt-2 text-xs text-[#6b746d]">{formatDisplayDate(review.meeting_date)}</p>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
