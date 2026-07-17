import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Clock3, ShieldCheck, Video } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardStateCard = ({ status = "NO_BOOKING", booking = {}, onBookCircle, isBooking = false }) => {
  const isZoomReady = Boolean(booking?.meetingLink);
  const details = {
    title: booking.title || "The Gentle Reset Circle",
    date: booking.date || "To be confirmed",
    time: booking.time || "To be confirmed",
    host: booking.host || "Circlia host",
    location: booking.location || "Online session",
    paymentStatus: booking.paymentStatus || "Awaiting confirmation",
  };

  if (status === "NO_BOOKING") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[35px] border border-[#efe7dc] bg-white p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)] lg:p-10"
      >
        <p className="mb-3 text-sm uppercase tracking-[5px] text-[#8B6E63]">
          Welcome
        </p>

        <h2
          className="mb-6 text-4xl lg:text-5xl"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Your first circle is waiting 🤍
        </h2>

        <p className="mb-8 max-w-2xl leading-8 text-gray-600">
          Every meaningful journey starts with one conversation. Book your first
          Circlia session and become part of a calm, supportive community.
        </p>

        <div className="mb-8 flex flex-wrap gap-4 text-sm text-gray-600">
          <span className="rounded-full bg-[#f8f1e8] px-4 py-2">
            Verified bookings
          </span>
          <span className="rounded-full bg-[#f8f1e8] px-4 py-2">
            Zoom access after approval
          </span>
          <span className="rounded-full bg-[#f8f1e8] px-4 py-2">
            Gentle reminders before each session
          </span>
        </div>

        <button
          type="button"
          onClick={onBookCircle}
          disabled={isBooking}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-sage)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isBooking ? "Booking..." : "Book your first circle"} <ArrowRight size={16} />
        </button>
      </motion.div>
    );
  }

  if (status === "PENDING") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-[35px] border border-[#e8d8b8] bg-[#FFF8ED] p-8 lg:p-10"
      >
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[4px] text-[#8B6E63]">
          <Clock3 size={16} /> Booking review
        </div>

        <h2
          className="mb-5 mt-4 text-4xl"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Your request is being reviewed
        </h2>

        <p className="mb-6 leading-8 text-gray-700">
          We have received your booking request and our team will verify it shortly.
          You will receive an email as soon as your booking is approved.
        </p>

        <div className="rounded-[24px] border border-[#eadfc8] bg-white/70 p-5 text-sm text-gray-700">
          <p className="font-semibold text-[#314131]">What happens next</p>
          <ul className="mt-3 space-y-2">
            <li>• We confirm your booking details and payment status.</li>
            <li>• The admin team approves the session for your dashboard.</li>
            <li>• Your Zoom link becomes available once the session is approved.</li>
          </ul>
        </div>
      </motion.div>
    );
  }

  if (status === "APPROVED") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-[35px] border border-[#efe7dc] bg-white p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)] lg:p-10"
      >
        <p className="mb-3 text-sm uppercase tracking-[5px] text-[#8B6E63]">
          Your next circle
        </p>

        <h2
          className="mb-8 text-4xl"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          {details.title}
        </h2>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-[24px] bg-[#f8f1e8] p-5">
            <p className="text-sm text-gray-500">Date</p>
            <h4 className="mt-2 text-lg font-semibold text-[#314131]">{details.date}</h4>
          </div>

          <div className="rounded-[24px] bg-[#f8f1e8] p-5">
            <p className="text-sm text-gray-500">Time</p>
            <h4 className="mt-2 text-lg font-semibold text-[#314131]">{details.time}</h4>
          </div>

          <div className="rounded-[24px] bg-[#f8f1e8] p-5">
            <p className="text-sm text-gray-500">Host</p>
            <h4 className="mt-2 text-lg font-semibold text-[#314131]">{details.host}</h4>
          </div>

          <div className="rounded-[24px] bg-[#f8f1e8] p-5">
            <p className="text-sm text-gray-500">Access</p>
            <h4 className="mt-2 text-lg font-semibold text-green-700">
              Approved
            </h4>
          </div>
        </div>

        <div className="mb-6 rounded-[24px] border border-[#e8d8b8] bg-[#fffaf2] p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#7A8E7B]">
            <ShieldCheck size={16} /> Payment and access status
          </div>
          <p className="mt-3 text-sm leading-7 text-gray-700">
            {isZoomReady
              ? "Your Zoom link is now active. Please join 10 minutes before the session begins."
              : "Your booking has been approved. The Zoom link will be activated once payment is verified and access is enabled by the admin team."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {isZoomReady ? (
            <a
              href={booking.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-sage)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Video size={16} /> Join Zoom meeting
            </a>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8c9b1] bg-[#f8f1e8] px-5 py-3 text-sm font-semibold text-[#314131]">
              <CalendarDays size={16} /> Zoom link pending
            </div>
          )}

          <Link
            to="/circles"
            className="inline-flex items-center gap-2 rounded-full border border-[#d8c9b1] px-5 py-3 text-sm font-semibold text-[#314131] transition hover:bg-[#f8f1e8]"
          >
            Browse more circles <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-[35px] border border-[#efe7dc] bg-white p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)] lg:p-10"
    >
      <h2
        className="mb-6 text-4xl"
        style={{ fontFamily: "Cormorant Garamond, serif" }}
      >
        Thank you 🤍
      </h2>

      <p className="mb-8 leading-8 text-gray-600">
        We hope your last circle brought connection, reflection and confidence.
        We would love to welcome you back whenever you are ready.
      </p>

      <button
        type="button"
        onClick={onBookCircle}
        disabled={isBooking}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-sage)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isBooking ? "Booking..." : "Book another circle"} <ArrowRight size={16} />
      </button>
    </motion.div>
  );
};

export default DashboardStateCard;