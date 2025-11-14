import React from "react";
import { motion } from "framer-motion";

const Spinner = () => {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col justify-center items-center bg-black/50 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative w-20 h-20 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "linear",
        }}
      >
        <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-xl"></div>

        <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500"></div>

        <motion.div
          className="absolute w-4 h-4 rounded-full bg-blue-500"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [1, 0.6, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "easeInOut",
          }}
        />
      </motion.div>

     
    </motion.div>
  );
};

export default Spinner;
