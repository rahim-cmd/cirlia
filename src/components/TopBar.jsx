import { motion } from "framer-motion";

const TopBar = () => {
  return (
    <motion.div
      initial={{ y: -40 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="
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
      🤍 A nurturing space created for pregnant women and their wellness journey
    </motion.div>
  );
};

export default TopBar;
