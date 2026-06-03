import { motion } from "framer-motion";

const AboutHero = () => {
  return (
    <section className="pt-52 pb-32">

      <div className="max-w-6xl mx-auto px-6 text-center">

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
          Our Story
        </motion.p>

        <motion.h1
          initial={{
            opacity: 0,
            y: 50
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 1
          }}
          className="
          text-6xl
          md:text-8xl
          leading-none
          "
          style={{
            fontFamily:
              "Cormorant Garamond, serif"
          }}
        >
          Creating Space
          <br />
          For Meaningful
          <br />
          Connection
        </motion.h1>

        <motion.p
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            delay: .3
          }}
          className="
          max-w-3xl
          mx-auto
          mt-10
          text-lg
          leading-9
          opacity-80
          "
        >
          Circlia was created to encourage reflection,
          creativity and genuine connection through
          journaling, mindful practices and shared experiences.
        </motion.p>

      </div>

    </section>
  );
};

export default AboutHero;