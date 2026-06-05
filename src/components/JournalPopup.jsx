import { useEffect, useState } from "react";
import { usePopup } from "../context/PopupContext";
import { motion, AnimatePresence } from "framer-motion";

const JournalPopup = () => {
  const { showPopup, closePopup } = usePopup();

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
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form);

    alert(
      "EmailJS integration next step."
    );

    closePopup();
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
              h-64
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
                Receive Your Free Journal
              </h2>

              <p
                className="
                text-center
                mb-6
                opacity-80
                "
              >
                Join hundreds of women beginning
                a deeper reflection journey.
              </p>

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
                  Receive Free Journal
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