import { motion } from "framer-motion";
import Container from "./Container";

const steps = [
  {
    title: "Opening Grounding",
    text: "A gentle arrival into the space."
  },
  {
    title: "Visual Meditation",
    text: "Guided imagery and visual journeys designed to encourage reflection and awareness."
  },
  {
    title: "Reflective Journaling",
    text: "Space to explore emotions, imagery, sensations and thoughts."
  },
  {
    title: "Weekly Themes",
    text: "Softness • Trust • Rest • Intuition • Becoming • Connection"
  },
  {
    title: "Sharing Circle",
    text: "An optional space for reflection and witnessing."
  },
  {
    title: "Closing Meditation",
    text: "A gentle transition back into the present moment."
  }
];

const FlowSection = () => {
  return (
    <section className="py-40 relative text-dark">

      <Container>

        <div className="text-center mb-24">

          <p
            className="uppercase tracking-[6px] text-sm mb-4"
            style={{ color: "var(--color-sage)" }}
          >
            Circle Journey
          </p>

          <h2
            className="text-5xl md:text-7xl"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              color: "var(--color-textLight)"
            }}
          >
            How A Circle Flows
          </h2>

        </div>

        <div className="relative">

          <div
            className="absolute left-1/2 top-0 h-full w-[1px]"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(158, 141, 136, 0.94), transparent)"
            }}
          />

          {steps.map((step, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: .8 }}
              viewport={{ once: true }}
              className={`mb-20 flex ${
                index % 2 === 0
                  ? "justify-start"
                  : "justify-end"
              }`}
            >

              <div
                className="w-full md:w-[45%] p-8 rounded-[30px] backdrop-blur-xl"
                style={{
                  background: "rgba(110, 52, 5, 0.35)",
                  border: "1px solid rgba(255,255,255,.3)"
                }}
              >

                <span
                  className="text-sm tracking-[4px]"
                  style={{
                    color: "var(--color-sage)"
                  }}
                >
                  0{index + 1}
                </span>

                <h3
                  className="text-3xl mt-4 mb-4"
                  style={{
                    fontFamily:
                      "Cormorant Garamond, serif"
                  }}
                >
                  {step.title}
                </h3>

                <p className="leading-8 opacity-80">
                  {step.text}
                </p>

              </div>

            </motion.div>

          ))}

        </div>

      </Container>

    </section>
  );
};

export default FlowSection;