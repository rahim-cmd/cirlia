import { motion } from "framer-motion";

const FloatingShapes = () => {
  return (
    <>
      <motion.div
        animate={{
          y: [0, -30, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 8
        }}
        className="absolute top-[15%] left-[8%] w-32 h-32 rounded-full bg-[#D8B4A0]/20 blur-xl"
      />

      <motion.div
        animate={{
          y: [0, 40, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 10
        }}
        className="absolute right-[8%] top-[50%] w-40 h-40 rounded-full bg-[#A8B5A2]/20 blur-xl"
      />

      <motion.div
        animate={{
          y: [0, -20, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 7
        }}
        className="absolute bottom-[10%] left-[40%] w-24 h-24 rounded-full bg-[#C98C72]/20 blur-xl"
      />
    </>
  );
};

export default FloatingShapes;