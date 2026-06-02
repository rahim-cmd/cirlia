import { motion } from "framer-motion";
import Container from "./Container";
import FadeUp from "./FadeUp";

const JournalSection = () => {
  return (
<FadeUp>
    <section className="py-40">

      <Container>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="rounded-[40px] p-12 md:p-20"
          style={{
            background:
              "linear-gradient(135deg,#f4ece5,#efe3da)"
          }}
        >

          <p
            className="uppercase tracking-[6px] text-sm mb-6"
            style={{ color: "var(--color-sage)" }}
          >
            Gifted Journal
          </p>

          <h2
            className="text-5xl md:text-7xl mb-8"
            style={{
              fontFamily: "Cormorant Garamond, serif"
            }}
          >
            A Gifted Prenatal
            <br />
            Reflection Journal
          </h2>

          <p className="max-w-3xl text-lg leading-10 mb-10 opacity-80">

            Created using hand-painted artwork,
            reflective prompts and visual meditation
            inspired pages designed to support moments
            of pause, connection and inner reflection.

          </p>

          <button
            className="px-8 py-4 rounded-full text-white"
            style={{
              backgroundColor:
                "var(--color-sage)"
            }}
          >
            Receive The Journal
          </button>

        </motion.div>

      </Container>

    </section>
</FadeUp>
  );
};

export default JournalSection;