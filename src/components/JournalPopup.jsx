import { useEffect, useState } from "react";
import { usePopup } from "../context/PopupContext";
import { motion, AnimatePresence } from "framer-motion";
import { sendJournalRequest } from "../utils/email";

const JournalPopup = () => {
  const { showPopup, closePopup } = usePopup();
  const isLoggedIn = Boolean(typeof window !== "undefined" && localStorage.getItem("token"));

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closePopup();
    };

    window.addEventListener("keydown", handleEsc);

    return () =>
      window.removeEventListener("keydown", handleEsc);
  }, [closePopup]);

 const [loading, setLoading] =
  useState(false);

const [success, setSuccess] =
  useState(false);

  if (isLoggedIn) {
    return null;
  }

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    await sendJournalRequest({
      lead_type: "Journal Request",

      user_name: form.name,

      user_email: form.email,

      message:
        "User wants to receive the free journal.",
    });

    setSuccess(true);

    setForm({
      name: "",
      email: "",
    });

    setTimeout(() => {
      closePopup();
      setSuccess(false);
    }, 50000);
  } catch (error) {
    console.error(error);

    alert(
      "Unable to submit request. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePopup}
          className="
          fixed
          inset-0
          z-[999]
          bg-black/50
          backdrop-blur-sm
          flex
          items-center
          justify-center
          p-4
          "
        >
          <motion.div
            onClick={(e) =>
              e.stopPropagation()
            }
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
            }}
            className="
            bg-[#FBF6F2]
            rounded-[40px]
            max-w-md
            w-full
            overflow-hidden
            shadow-2xl
            "
          >
            <img
              src="/images/founder.jpeg"
              alt=""
              className="
              w-full
              h-54
              object-cover
              object-center
              "
            />

            <div className="p-8">

              <h2
                className="
                text-4xl
                mb-4
                text-center
                "
                style={{
                  fontFamily:
                    "Cormorant Garamond, serif",
                }}
              >
                Receive Your Hand Painted Prenatal Journal
              </h2>

              <p
                className="
                text-center
                mb-6
                opacity-80
                "
              >
                Join our circle of women beginning
                a deeper reflection journey.
              </p>

{success && (
  <div
    className="
    mb-6
    p-4
    rounded-2xl
    bg-green-100
    text-green-800
    text-center
    "
  >
    ✨ Thank you.

    <br />

    Your request has been received.

    We will personally send your
    Reflection Journal soon.
  </div>
)}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="
                  w-full
                  border
                  rounded-full
                  px-5
                  py-4
                  "
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  className="
                  w-full
                  border
                  rounded-full
                  px-5
                  py-4
                  "
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />

                <button
                  type="submit"
                   disabled={loading}
                  className="
                  w-full
                  py-4
                  rounded-full
                  text-white
                  "
                  style={{
                    background:
                      "var(--color-sage)",
                  }}
                >
                  {loading
 ? "Sending..."
 : "Receive Free Journal"}
                </button>
              </form>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JournalPopup;