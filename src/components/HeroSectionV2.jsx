import { motion } from "framer-motion";
import Button from "./Button";
import { usePopup } from "../context/PopupContext";
import { Link } from "react-router-dom";

const HeroSectionV2 = () => {
  const { openPopup } = usePopup();
 
  return (
    
    <section className="min-h-screen flex items-center pt-32 pb-20 relative overflow-hidden">

      {/* Background Glow */}

      <div className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full bg-[#D8B4A0]/20 blur-[120px]" />

      <div className="container mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT CONTENT */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >

            <p
              className="uppercase tracking-[8px] mb-6 text-sm"
              style={{
                color: "var(--color-brown)"
              }}
            >
              Women's Reflection Circles
            </p>

            <h1
              className="text-5xl sm:text-6xl lg:text-8xl leading-[0.95]"
              style={{
                fontFamily: "Cormorant Garamond, serif"
              }}
            >
              A space
              <br />

              for women
              <br />

              to connect
            </h1>

            <p
              className="mt-10 text-lg leading-9 max-w-xl opacity-80"
            >
              Visual meditation, reflective journaling
              and meaningful conversations designed to
              support creativity, presence and connection.
            </p>

            <div className="flex flex-wrap gap-5 mt-12">

              <Button>
                <Link to="/contact">
                Join A Circle
                </Link>
              </Button>

              <button
                className="
                px-8
                py-4
                rounded-full
                border
                border-[#6B4E45]
                hover:bg-[#6B4E45]
                hover:text-white
                transition-all
                duration-500
                "
              onClick={openPopup}>
                Receive Journal
              </button>

            </div>

            {/* MINI INFO */}

            <div className="flex gap-10 mt-14">

              <div>
                <h3 className="text-3xl font-light">
                  Weekly
                </h3>

                <p className="opacity-70">
                  Online Circles
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-light">
                  Zoom
                </h3>

                <p className="opacity-70">
                  Guided Sessions
                </p>
              </div>

            </div>

          </motion.div>

          {/* RIGHT IMAGE */}

          <motion.div
            initial={{
              opacity: 0,
              x: 60
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              duration: 1
            }}
            className="relative"
          >

            {/* Floating Card */}

            <motion.div
              animate={{
                y: [0, -10, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 5
              }}
              className="
              absolute
              -top-6
              -left-6
              z-20
              bg-white
              shadow-xl
              rounded-3xl
              px-6
              py-4
              "
            >
              <p className="text-sm">
                Weekly Women's Circle
              </p>
            </motion.div>

            {/* IMAGE */}

            <motion.div
              whileHover={{
                scale: 1.02
              }}
              transition={{
                duration: .5
              }}
              className="
              overflow-hidden
              rounded-[40px]
              shadow-2xl
              "
            >

              <img
                src="/images/hero.png"
                alt="Circlia"
                className="
                w-full
                h-[700px]
                object-cover
                "
              />

            </motion.div>

            {/* FLOATING BADGE */}

            <motion.div
              animate={{
                y: [0, 15, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 6
              }}
              className="
              absolute
              bottom-10
              -right-6
              bg-white
              rounded-full
              px-8
              py-5
              shadow-xl
              "
            >
              Presence • Reflection • Connection
            </motion.div>

          </motion.div>

        </div>

      </div>

    </section>
  );
};

export default HeroSectionV2;