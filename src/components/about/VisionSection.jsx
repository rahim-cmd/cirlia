import { motion } from "framer-motion";

const VisionSection = () => {
  return (
    <section className="py-40 relative overflow-hidden">

      <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-[#E8DCD2] blur-[120px]" />
      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-[#F3E8E0] blur-[150px]" />

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="
          text-5xl
          md:text-8xl
          leading-none
          "
          style={{
            fontFamily: "Cormorant Garamond, serif"
          }}
        >
          A Future Where
          <br />
          Women Gather,
          <br />
          Reflect &
          <br />
          Grow Together
        </motion.h2>

      </div>

    </section>
  );
};

export default VisionSection;