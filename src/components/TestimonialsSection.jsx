import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { reviewsApi } from "../lib/reviewsApi";
import { formatDisplayDate } from "../utils/formatters";

const renderStars = (rating) => {
  const safeRating = Math.max(0, Math.min(5, Number(rating || 0)));

  return Array.from({ length: 5 }, (_, index) => {
    const active = index < safeRating;

    return (
      <Star
        key={`star-${index}`}
        size={14}
        className={active ? "fill-[#f0a63b] text-[#f0a63b]" : "text-[#d7c7ad]"}
      />
    );
  });
};

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadReviews = async () => {
      try {
        const result = await reviewsApi.getHomepageReviews(12);

        if (!ignore) {
          const filtered = result.filter((item) => Number(item.rating) > 0 && String(item.review_text || "").trim());
          setReviews(filtered);
        }
      } catch {
        if (!ignore) {
          setReviews([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadReviews();

    const refreshReviews = () => {
      if (!ignore) {
        loadReviews();
      }
    };

    window.addEventListener("circlia:reviews-changed", refreshReviews);

    return () => {
      ignore = true;
      window.removeEventListener("circlia:reviews-changed", refreshReviews);
    };
  }, []);

  const hasReviews = useMemo(() => reviews.length > 0, [reviews]);

  if (isLoading || !hasReviews) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#faf4eb] px-4 py-16 md:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -left-12 top-10 h-40 w-40 rounded-full bg-[#e7d8c3]/70 blur-2xl" />
        <div className="absolute -right-10 bottom-8 h-48 w-48 rounded-full bg-[#d3e3d3]/70 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-[5px] text-[#8b6e63]">Testimonials</p>
        <h2 className="mt-3 text-4xl text-[#243224] md:text-5xl" style={{ fontFamily: "Cormorant Garamond, serif" }}>
          What members say
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f665f]">
          Real feedback from recent circles, shared publicly by members and published after admin approval.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.id || `${review.booking_id}-${review.created_at}`}
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
