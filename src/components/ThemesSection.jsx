import { motion } from "framer-motion";

const themes = [
  "Connection",
  "Creativity",
  "Presence",
  "Self Trust",
  "Reflection",
  "Healing",
  "Joy",
  "Belonging",
];

const positions = [
  "ml-0 md:ml-0",
  "ml-4 md:ml-32",
  "ml-2 md:ml-12",
  "ml-6 md:ml-48",
  "ml-3 md:ml-20",
  "ml-8 md:ml-40",
  "ml-2 md:ml-8",
  "ml-10 md:ml-56",
];

const ThemesSection = () => {
  return (
    <section className="py-40 overflow-hidden relative">

      {/* Background Blob 1 */}

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
        opacity-50
        "
      />

      {/* Background Blob 2 */}

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
        opacity-50
        "
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        <div className="text-center mb-24">

          <p
            className="
            uppercase
            tracking-[8px]
            text-sm
            mb-4
            "
            style={{
              color: "var(--color-brown)"
            }}
          >
            Circle Themes
          </p>

          <h2
            className="
            text-5xl
            md:text-7xl
            "
            style={{
              fontFamily:
                "Cormorant Garamond, serif"
            }}
          >
            Topics We Explore
          </h2>

        </div>

        <div className="space-y-10">

          {themes.map((theme, index) => (

            <motion.div
              key={theme}
              initial={{
                opacity: 0,
                x: -50
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: index * 0.08
              }}
              className={positions[index]}
            >
              <motion.div
                whileHover={{
                  scale: 1.08,
                  rotate: index % 2 ? 2 : -2,
                }}
                transition={{
                  type: "spring",
                  stiffness: 250
                }}
                className="
                inline-block
                px-10
                py-6
                rounded-full
                bg-white/70
                backdrop-blur-xl
                shadow-lg
                cursor-pointer
                "
              >
                <span
                  className="
                  text-2xl
                  md:text-4xl
                  "
                  style={{
                    fontFamily:
                      "Cormorant Garamond, serif"
                  }}
                >
                  {theme}
                </span>
              </motion.div>
            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default ThemesSection;