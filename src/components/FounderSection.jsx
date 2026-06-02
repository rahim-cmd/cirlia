import { motion } from "framer-motion";
import Container from "./Container";
import Button from "./Button";

const FounderSection = () => {
  return (
    <section className="py-40 relative overflow-hidden">

      {/* Background Blob */}

      <div
        className="
        absolute
        -left-32
        top-20
        w-[500px]
        h-[500px]
        rounded-full
        bg-[#D8B4A0]/20
        blur-[140px]
        "
      />

      <Container>

        <div className="grid lg:grid-cols-2 gap-24 items-center">

          {/* IMAGE */}

          <motion.div
            initial={{
              opacity: 0,
              x: -80
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            transition={{
              duration: 1
            }}
            viewport={{
              once: true
            }}
            className="relative"
          >

            <div
              className="
              absolute
              -top-8
              -right-8
              bg-white
              rounded-3xl
              px-6
              py-4
              shadow-xl
              z-20
              "
            >
              Founder • Guide • Facilitator
            </div>

            <div
              className="
              overflow-hidden
              rounded-[40px]
              shadow-2xl
              "
            >
              <img
                src="/images/founder.jpeg"
                alt="Founder"
                className="
                w-full
                h-[580px]
                object-cover
                transition-all
                duration-700
                hover:scale-115
                origin-center
                "
              />
            </div>

          </motion.div>

          {/* CONTENT */}

          <motion.div
            initial={{
              opacity: 0,
              x: 80
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            transition={{
              duration: 1
            }}
            viewport={{
              once: true
            }}
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
              Meet The Founder
            </p>

            <h2
              className="
              text-5xl
              md:text-7xl
              leading-[1]
              mb-10
              "
              style={{
                fontFamily:
                  "Cormorant Garamond, serif"
              }}
            >
              Creating spaces
              <br />
              for reflection,
              <br />
              creativity &
              connection
            </h2>

            <p
              className="
              text-lg
              leading-10
              opacity-80
              mb-8
              "
            >
              Circlia emerged from a desire to create
              gentle spaces where women can slow down,
              reconnect with themselves and share
              meaningful moments with others.
            </p>

            <p
              className="
              text-lg
              leading-10
              opacity-80
              mb-10
              "
            >
              Through meditation, movement, journaling
              and conversation, each gathering invites
              presence, curiosity and self-reflection.
            </p>

            {/* Quote */}

            <div
              className="
              border-l-4
              pl-6
              mb-12
              "
              style={{
                borderColor:
                  "var(--color-brown)"
              }}
            >
              <p
                className="
                text-2xl
                italic
                "
                style={{
                  fontFamily:
                    "Cormorant Garamond, serif"
                }}
              >
                “My intention is not to teach,
                but to create a space where women
                can reconnect with their own wisdom.”
              </p>
            </div>

            <Button>
              Learn More
            </Button>

          </motion.div>

        </div>

      </Container>

    </section>
  );
};

export default FounderSection;