import { motion } from "framer-motion";
import Container from "./Container";

const themes = [
  "Softness",
  "Trust",
  "Rest",
  "Intuition",
  "Transition",
  "Becoming",
  "Connection",
  "Body Awareness"
];

const ThemesSection = () => {
  return (
    <section className="py-32">

      <Container>

        <div className="text-center mb-16">

          <p
            className="uppercase tracking-[6px] text-sm mb-4"
            style={{ color: "var(--color-sage)" }}
          >
            Weekly Themes
          </p>

          <h2
            className="text-5xl md:text-7xl"
            style={{
              fontFamily: "Cormorant Garamond, serif"
            }}
          >
            Exploring What Matters
          </h2>

        </div>

        <div className="flex flex-wrap justify-center gap-5">

          {themes.map((theme, index) => (
            <motion.div
              key={index}
              whileHover={{
                scale: 1.08,
                y: -5
              }}
              className="px-8 py-4 rounded-full backdrop-blur-xl"
              style={{
                background: "rgba(110, 52, 5, 0.35)",
                border: "1px solid rgba(255,255,255,.25)"
              }}
            >
              {theme}
            </motion.div>
          ))}

        </div>

      </Container>

    </section>
  );
};

export default ThemesSection;