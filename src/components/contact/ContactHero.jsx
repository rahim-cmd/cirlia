import { motion } from "framer-motion";

const ContactHero = () => {
  return (
    <section className="pt-52 pb-24">

      <div className="max-w-5xl mx-auto px-6 text-center">

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
            color: "#8B6B5C"
          }}
        >
          Contact
        </motion.p>

        <motion.h1
          initial={{
            opacity: 0,
            y: 40
          }}
          animate={{
            opacity: 1,
            y: 0
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
          We'd Love
          <br />
          To Hear
          <br />
          From You
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
          Have a question, idea or simply wish to connect?
          We'd be delighted to hear from you.
        </p>

      </div>

    </section>
  );
};

export default ContactHero;