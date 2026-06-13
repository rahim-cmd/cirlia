import { AnimatePresence, motion } from "framer-motion";

const pages = [
  "/journal/page1.png",
  "/journal/page2.png",
  "/journal/page3.png",
  "/journal/page4.png",
];

const JournalFlipBook = ({
  open,
  onClose,
  openPopup,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
          fixed
          inset-0
          z-[999]
          bg-[#FBF6F2]
          overflow-y-auto
          "
        >
          {/* Close */}

          <button
            onClick={onClose}
            className="
            fixed
            top-6
            right-6
            z-50
            bg-white
            w-12
            h-12
            rounded-full
            shadow-lg
            "
          >
            ✕
          </button>

          <div className="max-w-4xl mx-auto py-24 px-6">

            {pages.map((page, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 50,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                className="mb-10"
              >
                <img
                  src={page}
                  alt=""
                  className="
                  w-full
                  rounded-[30px]
                  shadow-xl
                  "
                />
              </motion.div>
            ))}

            {/* LOCKED PAGE */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
              }}
              className="
              rounded-[40px]
              bg-white
              p-16
              text-center
              shadow-xl
              "
            >
              <div className="text-6xl mb-6">
                🔒
              </div>

              <h2
                className="text-5xl mb-6"
                style={{
                  fontFamily:
                    "Cormorant Garamond, serif",
                }}
              >
                Continue Reading
              </h2>

              <p className="mb-10 opacity-70">
                The rest of the journal
                contains guided reflections,
                mindful exercises and deeper
                practices.
              </p>

              <button
                onClick={openPopup}
                className="
                px-10
                py-5
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
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JournalFlipBook;