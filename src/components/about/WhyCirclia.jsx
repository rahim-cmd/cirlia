import { motion } from "framer-motion";

const WhyCirclia = () => {
  return (
    <section className="py-32">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-20">

          <div>

            <p
              className="
              uppercase
              tracking-[6px]
              text-sm
              mb-6
              "
            >
              Why Circlia Exists
            </p>

            <h2
              className="
              text-5xl
              md:text-6xl
              "
              style={{
                fontFamily:
                  "Cormorant Garamond, serif"
              }}
            >
              A Gentle Invitation
              To Slow Down
            </h2>

          </div>

          <div>

            <p
              className="
              text-lg
              leading-9
              opacity-80
              "
            >
              Life often moves quickly.
              Between responsibilities, expectations
              and daily routines, it can become difficult
              to create space for reflection.

              <br /><br />

              Circlia was created as a place where women
              can reconnect with themselves through
              thoughtful journaling, creativity and
              meaningful conversation.

              <br /><br />

              We believe growth begins when we pause long
              enough to listen to ourselves.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default WhyCirclia;