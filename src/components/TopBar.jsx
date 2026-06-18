import { motion } from "framer-motion";

const TopBar = () => {
  return (
    <>
      {/* Desktop Top Bar */}

      <motion.div
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="
        hidden
        md:block
        sticky
        top-0
        z-[60]
        w-full
        py-3
        text-center
        text-white
        "
        style={{
          background: "var(--color-sage)",
        }}
      >
        🤍 A nurturing space created for all women and their wellness journey
      </motion.div>

      {/* Mobile Bottom Pill */}

      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="
        md:hidden
        fixed
        bottom-4
        left-1/2
        -translate-x-1/2
        z-[100]

        px-5
        py-3

        rounded-full

        text-white
        text-xs

        shadow-xl
        backdrop-blur-xl

        w-[92%]
        max-w-sm
        text-center
        "
        style={{
          background: "var(--color-sage)",
        }}
      >
        🤍 A nurturing space for pregnant women
      </motion.div>
    </>
  );
};

export default TopBar;