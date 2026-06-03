import { motion } from "framer-motion";

const values = [
  {
    title: "Presence",
    text: "Creating space to pause, notice and reconnect with what truly matters."
  },
  {
    title: "Connection",
    text: "Encouraging meaningful conversations and authentic relationships."
  },
  {
    title: "Creativity",
    text: "Using reflection, writing and expression as tools for growth."
  },
  {
    title: "Compassion",
    text: "Approaching ourselves and others with kindness and understanding."
  }
];

const ValuesSection = () => {
  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">
          <p className="uppercase tracking-[8px] text-sm mb-4 text-[#8B6B5C]">
            What We Value
          </p>

          <h2
            className="text-5xl md:text-7xl"
            style={{
              fontFamily: "Cormorant Garamond, serif"
            }}
          >
            The Heart Of Circlia
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {values.map((value) => (
            <motion.div
              key={value.title}
              whileHover={{
                y: -10,
                rotate: 1
              }}
              className="
              bg-white/70
              backdrop-blur-xl
              rounded-[30px]
              p-8
              shadow-lg
              "
            >
              <h3
                className="text-3xl mb-4"
                style={{
                  fontFamily: "Cormorant Garamond, serif"
                }}
              >
                {value.title}
              </h3>

              <p className="leading-8 opacity-80">
                {value.text}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default ValuesSection;