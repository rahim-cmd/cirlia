import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Opening Grounding",
    description:
      "A gentle arrival into the space through mindful breathing, awareness and intention setting.",
    image: "/images/flow1.jpg",
  },
  {
    number: "02",
    title: "Visual Meditation",
    description:
      "Guided visual experiences that encourage calmness, imagination and self-awareness.",
    image: "/images/flow2.jpg",
  },
  {
    number: "03",
    title: "Reflective Journaling",
    description:
      "Meaningful prompts and creative reflection designed to deepen personal insight.",
    image: "/images/flow3.jpg",
  },
  {
    number: "04",
    title: "Circle Sharing",
    description:
      "A supportive space where women can listen, connect and share experiences together.",
    image: "/images/flow5.png",
  },
];

const FlowSection = () => {
  return (
    <section className="py-40 overflow-hidden">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-32">

          <p
            className="uppercase tracking-[8px] text-sm mb-4"
            style={{
              color: "var(--color-brown)"
            }}
          >
            The Experience
          </p>

          <h2
            className="text-5xl md:text-7xl"
            style={{
              fontFamily: "Cormorant Garamond, serif"
            }}
          >
            What Happens
            <br />
            Inside A Circle
          </h2>

        </div>

        {steps.map((step, index) => (

          <motion.div
            key={index}
            initial={{
              opacity: 0,
              y: 80
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.8
            }}
            className="
            grid
            lg:grid-cols-2
            gap-16
            items-center
            mb-40
            "
          >

            {/* IMAGE LEFT */}

            {index % 2 === 0 && (
              <div className="relative">

                <div
                  className="
                  absolute
                  -top-6
                  -left-6
                  bg-white
                  px-5
                  py-3
                  rounded-full
                  shadow-xl
                  z-10
                  "
                  animate={{
  y: [0, -10, 0]
}}
transition={{
  repeat: Infinity,
  duration: 4
}}
                >
                  Step {step.number}
                </div>

                <div
                  className="
                  overflow-hidden
                  rounded-[40px]
                  "
                  whileHover={{
  y: -10
}}
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="
                    w-full
                    h-[600px]
                    object-cover
                    transition-all
                    duration-700
                    hover:scale-110
                    "
                  />
                </div>

              </div>
            )}

            {/* CONTENT */}

            <div>

              <span
                className="
                text-8xl
                md:text-9xl
                opacity-10
                block
                mb-4
                "
                
                style={{
                  fontFamily:
                    "Cormorant Garamond, serif"
                }}
              >
                {step.number}
              </span>

              <h3
                className="
                text-4xl
                md:text-6xl
                mb-8
                "
                style={{
                  fontFamily:
                    "Cormorant Garamond, serif"
                }}
              >
                {step.title}
              </h3>

              <p
                className="
                text-lg
                leading-9
                opacity-80
                max-w-xl
                "
              >
                {step.description}
              </p>

            </div>

            {/* IMAGE RIGHT */}

            {index % 2 !== 0 && (
              <div className="relative">

                <div
                  className="
                  absolute
                  -top-6
                  -right-6
                  bg-white
                  px-5
                  py-3
                  rounded-full
                  shadow-xl
                  z-10
                  "
                >
                  Step {step.number}
                </div>

                <div
                  className="
                  overflow-hidden
                  rounded-[40px]
                  "
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="
                    w-full
                    h-[600px]
                    object-cover
                    transition-all
                    duration-700
                    hover:scale-110
                    "
                  />
                </div>

              </div>
            )}

          </motion.div>

        ))}

      </div>

    </section>
  );
};

export default FlowSection;