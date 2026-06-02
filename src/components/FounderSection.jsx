import { motion } from "framer-motion";
import Container from "./Container";

const FounderSection = () => {
  return (
    <section className="py-40 relative">

      <Container>

        <div className="grid md:grid-cols-2 gap-20 items-center">

          {/* Left Visual */}

          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
              
            <div
              className="h-[550px] rounded-[40px]"
              style={{
                background:
                  "linear-gradient(135deg,#E9DDD3,#D8B4A0)"
              }}
            >
            <h1 className="text-red-500 p-7">Hello I am about div</h1>
            </div>
              
          </motion.div>

          {/* Right Content */}

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >

            <p
              className="uppercase tracking-[6px] text-sm mb-5"
              style={{
                color: "var(--color-sage)"
              }}
            >
              About The Founder
            </p>

            <h2
              className="text-5xl md:text-7xl mb-8"
              style={{
                fontFamily:
                  "Cormorant Garamond, serif"
              }}
            >
              A Journey
              <br />
              Through Reflection
            </h2>

            <p className="leading-10 text-lg opacity-80">

              My journey has been rooted in meditation,
              reflection, movement, and creative exploration.

              Over the years I have worked with women
              through mindful movement, guided meditations,
              prenatal practices and reflective experiences.

            </p>

            <p className="leading-10 text-lg opacity-80 mt-8">

              Circlia was created from a desire to offer
              women a calm and reflective space to gather,
              slow down and reconnect.

            </p>

          </motion.div>

        </div>

      </Container>

    </section>
  );
};

export default FounderSection;