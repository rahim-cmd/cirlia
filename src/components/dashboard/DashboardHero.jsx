import { motion } from "framer-motion";
import { ArrowRight, CalendarClock, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import TimeLine from "./TimeLine";

const getUserName = () => {
  if (typeof window === "undefined") {
    return "friend";
  }

  try {
    const storedUser = localStorage.getItem("user");
    const storedName = localStorage.getItem("userName");

    if (storedName) {
      return storedName;
    }

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (typeof parsedUser === "string") {
        return parsedUser;
      }

      return parsedUser?.first_name || parsedUser?.name || "friend";
    }
  } catch (error) {
    console.error("Unable to read user profile", error);
  }

  return "friend";
};

export default function DashboardHero({ status = "NO_BOOKING", onBookCircle, isBooking = false }) {
  const userName = getUserName();

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="overflow-hidden rounded-[35px] bg-gradient-to-r from-[#7A8E7B] to-[#8FA290] text-white"
      >
        <div className="grid items-center lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-8 lg:p-14">
            <p className="mb-4 text-sm uppercase tracking-[6px] opacity-80">
              Welcome back
            </p>

            <h1
              className="mb-6 text-5xl leading-tight lg:text-6xl"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Hello {userName} 🤍
            </h1>

            <p className="max-w-xl text-lg leading-8 opacity-90">
              We are so happy you are here. Every circle is a calm place to
              connect, reflect and grow with women who truly care.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onBookCircle}
                disabled={isBooking}
                className="inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-3 text-sm font-semibold text-[#5b6d56] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isBooking ? "Booking..." : "Book a circle"} <ArrowRight size={16} />
              </button>

              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View profile
              </Link>
            </div>
          </div>

          <div className="hidden justify-center p-6 lg:flex">
            <div className="w-full max-w-md rounded-[32px] border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm uppercase tracking-[4px] opacity-80">
                <Sparkles size={16} /> Your circle status
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="flex items-center gap-2">
                    <CalendarClock size={16} /> Upcoming session
                  </span>
                  <span className="font-semibold">Ready to confirm</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={16} /> Verified access
                  </span>
                  <span className="font-semibold">After approval</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <TimeLine status={status} />
    </>
  );
}
