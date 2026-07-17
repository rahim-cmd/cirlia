import { motion } from "framer-motion";
import Button from "./Button";
import { usePopup } from "../context/PopupContext";

const JournalSection = () => {
  const { openPopup } = usePopup();
  return (
    <section className="py-24 md:py-40 overflow-hidden">

      <div className="max-w-7xl mx-auto px-6">

       <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* LEFT */}

          <motion.div
            initial={{
              opacity: 0,
              x: -80
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >

            <p
              className="
              uppercase
              tracking-[8px]
              text-sm
              mb-6
              "
              style={{
                color: "var(--color-brown)"
              }}
            >
              Complimentary Gift
            </p>

            <h2
              className="
              text-4xl sm:text-5xl md:text-7xl
              "
              style={{
                fontFamily:
                  "Cormorant Garamond, serif"
              }}
            >
              Receive Our
              <br />
              Reflection
              <br />
              Journal
            </h2>

            <p
              className="
              text-base md:text-lg leading-8 md:leading-9
              opacity-80
              mb-10
              "
            >
              A beautifully crafted journal
              designed to support reflection,
              mindfulness, creativity and
              meaningful self-connection.
            </p>

            <div className="space-y-5 mb-12">

              <div className="flex items-center gap-4">
                <span>✦</span>
                <span>Love Letter To Self</span>
              </div>

              <div className="flex items-center gap-4">
                <span>✦</span>
                <span>Transformation Prompts</span>
              </div>

              <div className="flex items-center gap-4">
                <span>✦</span>
                <span>Creative Reflection Exercises</span>
              </div>

              <div className="flex items-center gap-4">
                <span>✦</span>
                <span>Mindful Daily Practices</span>
              </div>

            </div>

            <Button onClick={ openPopup }>
              Receive Free Journal
            </Button>

          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{
              opacity: 0,
              x: 80
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="
              relative
              mt-8
              lg:mt-0
              max-w-[420px]
              mx-auto
              w-full
              "
          >

            {/* BACK PAGE */}

            <div
              className="
              absolute
              top-6
              left-6
              w-[85%]
              h-[380px]
              md:h-[520px]
              rounded-[30px]
              bg-[#E9DDD3]
              rotate-[-8deg]
              "
            />

            {/* MIDDLE PAGE */}

            <div
              className="
              absolute
              top-3
              left-3
              w-[90%]
              h-[380px]
              md:h-[520px]
              rounded-[30px]
              bg-[#F2E9E2]
              rotate-[-4deg]
              "
            />

            {/* MAIN BOOK */}

            <motion.div
              whileHover={{
                y: -10,
                rotate: 1
              }}
              className="
              relative
              h-[380px]
              md:h-[520px]
              rounded-[30px]
              overflow-hidden
              shadow-2xl
              bg-[#FBF6F2]
              border
              border-[#E7DCD3]
              "
            >
              
              <div
                className="
                h-full
                flex
                flex-col
                justify-center
                items-center
                text-center
                px-6 md:px-10
                "
              >
  
                <p
                  className="
                  uppercase
                  tracking-[6px]
                  text-xs
                  mb-6
                  "
                >
                  Circlia
                </p>

                <h3
                  className="
                  text-4xl md:text-6xl
                  leading-none
                  "
                  style={{
                    fontFamily:
                      "Cormorant Garamond, serif"
                  }}
                >
                  Reflection
                  <br />
                  Journal
                </h3>

                <div
                  className="
                  w-24
                  h-[1px]
                  bg-[#6B4E45]
                  my-8
                  "
                />

                <p className="opacity-70 text-sm md:text-base">
                  Presence • Creativity • Connection
                </p>

              </div>

            </motion.div>

            {/* FLOATING BADGE */}

            <motion.div
              animate={{
                y: [0, -12, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 5
              }}
              className="
              absolute
              right-0
              md:-right-8
              bottom-4
              md:bottom-10
              text-sm
              md:text-base
              px-4
              md:px-6
              py-3
              md:py-4
              bg-white
              rounded-full
              px-6
              py-4
              shadow-xl
              "
            >
              Free PDF Guide
            </motion.div>

          </motion.div>

        </div>

      </div>

    </section>
  );
};

export default JournalSection;