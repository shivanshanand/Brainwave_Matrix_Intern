import { motion } from "framer-motion";
import { PenLine } from "lucide-react";

const Loading = ({
  message = "Loading...",
  className = "",
  variant = "default",
  size = "medium",
}) => {
  const sizeConfig = {
    small: { spinner: "h-8 w-8", text: "text-sm" },
    medium: { spinner: "h-12 w-12", text: "text-base" },
    large: { spinner: "h-16 w-16", text: "text-lg" },
  };

  const config = sizeConfig[size];

  const spinnerVariants = {
    spinning: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const textVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  if (variant === "branded") {
    return (
      <motion.div
        className={`flex items-center justify-center ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="text-center">
          <motion.div
            className="relative mb-6"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="bg-teal-400 p-4 rounded-2xl flex items-center justify-center mx-auto w-fit">
              <PenLine className="text-black w-8 h-8 font-bold" />
            </div>
          </motion.div>

          <div className="relative flex items-center justify-center mb-6">
            <motion.div
              className="absolute w-16 h-16 border-4 border-teal-500/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
              className="absolute w-12 h-12 border-3 border-transparent border-t-teal-400 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
              className="w-8 h-8 border-2 border-transparent border-t-teal-300 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <motion.p
            className={`text-gray-300 font-medium ${config.text}`}
            variants={textVariants}
            animate="animate"
          >
            {message}
          </motion.p>

          <div className="flex items-center justify-center gap-1 mt-4">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-teal-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === "minimal") {
    return (
      <motion.div
        className={`flex items-center justify-center ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className={`border-2 border-transparent border-t-teal-400 rounded-full ${config.spinner}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            className={`text-gray-400 ${config.text}`}
            variants={textVariants}
            animate="animate"
          >
            {message}
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      <div className="text-center">
        <div className="relative flex items-center justify-center mb-4">
          <motion.div
            className={`absolute border-4 border-teal-500/30 rounded-full ${config.spinner}`}
            animate={{
              rotate: 360,
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          />

          <motion.div
            className={`border-4 border-transparent border-t-teal-400 border-r-teal-400 rounded-full ${config.spinner}`}
            variants={spinnerVariants}
            animate="spinning"
          />

          <motion.div
            className="absolute w-2 h-2 bg-teal-400 rounded-full"
            variants={pulseVariants}
            animate="pulse"
          />
        </div>

        <motion.p
          className={`text-gray-400 font-medium ${config.text}`}
          variants={textVariants}
          animate="animate"
        >
          {message}
        </motion.p>

        <div className="flex items-center justify-center gap-1 mt-3">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-1.5 h-1.5 bg-teal-400 rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Loading;
