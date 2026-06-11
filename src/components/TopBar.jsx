import { motion } from "framer-motion";

const TopBar = () => {
  return (
    <motion.div
      initial={{ y: -40 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="
      w-full
      py-3
      text-center
      text-sm
      md:text-base
      tracking-wide
      text-white
      z-[1000]
      "
      style={{
        background: "var(--color-sage)"
      }}
    >
      🤍 A nurturing space created for pregnant women and their wellness journey
    </motion.div>
  );
};

export default TopBar;