import { motion } from "framer-motion";

const FounderStory = () => {
  return (
    <section className="py-40">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          <motion.div
            whileHover={{
              y: -10
            }}
          >
            <img
              src="/images/founder.jpeg"
              alt="Founder"
              className="
              w-full
              h-[500px]
              md:h-auto
              object-cover
              object-left
              rounded-[40px]
              shadow-2xl
              "
            />
          </motion.div>

          <div>

            <p
              className="
              uppercase
              tracking-[6px]
              text-sm
              mb-6
              "
            >
              Founder Story
            </p>

            <h2
              className="
              text-5xl
              md:text-6xl
              mb-8
              "
              style={{
                fontFamily:
                  "Cormorant Garamond, serif"
              }}
            >
              Meet The Heart
              Behind Circlia
            </h2>

            <p
              className="
              text-lg
              leading-9
              opacity-80
              "
            >
              Circlia grew from a desire to create
              meaningful spaces where women can pause,
              reflect and reconnect.

              <br /><br />

              Through journaling, creativity and
              intentional conversation, these spaces
              encourage presence, self-awareness and
              authentic connection.

              <br /><br />

              What began as a personal passion has become
              an invitation for women to gather, explore
              and grow together.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default FounderStory;