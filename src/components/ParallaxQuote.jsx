import { motion } from "framer-motion";

const ParallaxQuote = () => {
  return (
    <section
      className="
      relative
      h-[80vh]
      flex
      items-center
      justify-center
      overflow-hidden
      "
    >

      <img
        src="/images/founder.jpeg"
        className="
        absolute
        inset-0
        w-full
        h-full
        object-cover
        scale-110
        opacity-40
        "
      />

      <div
        className="
        absolute
        inset-0
        bg-radial-[at_25%_25%] from-sage to-rose-950 to-85%
        "
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 60
        }}
        whileInView={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 1
        }}
        className="
        relative
        z-10
        text-center
        px-6
        "
      >
        <h2
          className="
          text-6xl
          md:text-8xl
          leading-none
          text-white
          "
          style={{
            fontFamily:
              "Cormorant Garamond, serif"
          }}
        >
          Presence.
          <br />
          Connection.
          <br />
          Creativity.
        </h2>

      </motion.div>

    </section>
  );
};

export default ParallaxQuote;