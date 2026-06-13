import { motion } from "framer-motion";
import { usePopup } from "../context/PopupContext";

const pages = [
  "/journal/page1.png",
  "/journal/page2.png",
  "/journal/page3.png",
  "/journal/page4.png",
];

const JournalPreviewSection = () => {
  const { openPopup } = usePopup();

  return (
    <section className="py-40 overflow-hidden relative">

      {/* Background Glow */}

      <div
        className="
        absolute
        top-20
        left-10
        w-72
        h-72
        rounded-full
        bg-[#EADDD4]
        blur-[120px]
        opacity-40
        "
      />

      <div
        className="
        absolute
        bottom-20
        right-10
        w-96
        h-96
        rounded-full
        bg-[#F3EAE4]
        blur-[150px]
        opacity-40
        "
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Heading */}

        <div className="text-center mb-24">

          <p
            className="
            uppercase
            tracking-[8px]
            text-sm
            mb-5
            "
            style={{
              color: "var(--color-brown)"
            }}
          >
            Journal Preview
          </p>

          <h2
            className="
            text-5xl
            md:text-7xl
            mb-8
            "
            style={{
              fontFamily:
                "Cormorant Garamond, serif"
            }}
          >
            A Glimpse Inside
          </h2>

          <p
            className="
            max-w-2xl
            mx-auto
            text-lg
            opacity-80
            leading-8
            "
          >
            Explore a few pages from our
            Reflection Journal created to
            support mindfulness, emotional
            awareness and deeper connection
            during pregnancy.
          </p>

        </div>

        {/* Preview Pages */}

        <div
          className="
          grid
          md:grid-cols-2
          lg:grid-cols-5
          gap-8
          items-start
          "
        >

          {pages.map((page, index) => (

            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 50
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: index * 0.1
              }}
              whileHover={{
                y: -10,
                rotate: index % 2 ? 2 : -2
              }}
              className="
              rounded-[30px]
              overflow-hidden
              shadow-xl
              bg-white
              "
            >
              <img
                src={page}
                alt=""
                className="
                w-full
                h-[450px]
                object-cover
                "
              />
            </motion.div>

          ))}

          {/* Locked Page */}

          <motion.div
            initial={{
              opacity: 0,
              y: 50
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: 0.5
            }}
            className="
            relative
            rounded-[30px]
            overflow-hidden
            shadow-xl
            "
          >

            <img
              src="/journal/page4.png"
              alt=""
              className="
              w-full
              h-[450px]
              object-cover
              blur-sm
              scale-110
              "
            />

            <div
              className="
              absolute
              inset-0
              bg-white/50
              backdrop-blur-md
              flex
              flex-col
              items-center
              justify-center
              text-center
              p-6
              "
            >

              <div className="text-5xl mb-5">
                🔒
              </div>

              <h3
                className="
                text-3xl
                mb-4
                "
                style={{
                  fontFamily:
                    "Cormorant Garamond, serif"
                }}
              >
                Unlock Full Journal
              </h3>

              <p
                className="
                text-sm
                opacity-80
                mb-6
                "
              >
                25+ additional pages of
                reflections, prompts and
                mindful practices.
              </p>

              <button
                onClick={openPopup}
                className="
                px-8
                py-4
                rounded-full
                text-white
                "
                style={{
                  background:
                    "var(--color-sage)"
                }}
              >
                Receive Free Journal
              </button>

            </div>

          </motion.div>

        </div>

      </div>

    </section>
  );
};

export default JournalPreviewSection;