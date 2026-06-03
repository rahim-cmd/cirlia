import { motion } from "framer-motion";

const JournalHero = () => {
  return (
    <section className="pt-52 pb-32">

      <div className="max-w-5xl mx-auto px-6 text-center">

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="uppercase tracking-[8px] text-sm mb-6"
          style={{ color: "#8B6B5C" }}
        >
          Complimentary Journal
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
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
          Reflection
          <br />
          Journal
        </motion.h1>

        <p
          className="
          mt-8
          text-lg
          leading-9
          opacity-80
          max-w-2xl
          mx-auto
          "
        >
          A thoughtfully designed journal filled
          with prompts, reflections and mindful
          practices to support your personal journey.
        </p>

      </div>

    </section>
  );
};

export default JournalHero;