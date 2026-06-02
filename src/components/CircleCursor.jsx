import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CircleCursor = () => {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <motion.div
      animate={{
        x: position.x - 60,
        y: position.y - 60,
      }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 250,
      }}
      className="fixed top-0 left-0 z-[9999] pointer-events-none hidden lg:flex items-center justify-center"
    >
      <div className="relative w-[120px] h-[120px]">

        {/* Rotating Text */}

        <div className="absolute inset-0 animate-spin-slow">

          <svg viewBox="0 0 120 120">

            <defs>
              <path
                id="circlePath"
                d="
                M60,60
                m-45,0
                a45,45 0 1,1 90,0
                a45,45 0 1,1 -90,0
                "
              />
            </defs>

            <text
              fill="#6B4E45"
              fontSize="8"
              letterSpacing="3"
            >
              <textPath href="#circlePath">
                JOIN • OUR • CIRCLE • JOIN • OUR • CIRCLE •
              </textPath>
            </text>

          </svg>

        </div>

        {/* Center Dot */}

        <div className="absolute inset-0 flex items-center justify-center">

          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: "#6B4E45",
            }}
          />

        </div>

      </div>
    </motion.div>
  );
};

export default CircleCursor;