import { motion } from "framer-motion";
import { Home, Frown, ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-neutral-950 flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 rounded-full"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-neutral-900/95 backdrop-blur-lg rounded-3xl shadow-2xl px-8 py-12 max-w-lg w-full text-center relative z-10"
      >
        <motion.div
          variants={childVariants}
          animate={floatingAnimation}
          className="mx-auto w-24 h-24 bg-gradient-to-br from-cyan-600/20 to-teal-600/20 rounded-full flex items-center justify-center shadow-lg mb-6 border border-cyan-500/20"
        >
          <Frown className="w-12 h-12 text-cyan-400" />
        </motion.div>

        <motion.h1
          variants={childVariants}
          className="text-8xl font-extrabold mb-4 tracking-tight"
        >
          <motion.span
            className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            404
          </motion.span>
        </motion.h1>

        <motion.h2
          variants={childVariants}
          className="text-3xl font-bold text-white mb-4"
        >
          Oops! Page Not Found
        </motion.h2>

        <motion.p
          variants={childVariants}
          className="text-gray-400 mb-8 leading-relaxed"
        >
          The page you're looking for seems to have vanished into the digital
          void.
          <br />
          Don't worry, even the best explorers sometimes take a wrong turn!
        </motion.p>

        <motion.div
          variants={childVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={() => navigate("/")}
            whileHover={{
              scale: 1.05,
              boxShadow:
                "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            className="flex gap-2 items-center justify-center px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-cyan-600 hover:to-teal-500 text-white transition-all duration-200 shadow-lg group"
          >
            <motion.div
              whileHover={{ x: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Home className="w-5 h-5" />
            </motion.div>
            <span>Back to Home</span>
          </motion.button>

          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(115, 115, 115, 0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            className="flex gap-2 items-center justify-center px-6 py-3 rounded-xl font-semibold bg-neutral-800/50 border border-neutral-700 text-gray-300 hover:text-white hover:border-neutral-600 transition-all duration-200 shadow-lg group"
          >
            <motion.div
              whileHover={{ x: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.div>
            <span>Go Back</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
