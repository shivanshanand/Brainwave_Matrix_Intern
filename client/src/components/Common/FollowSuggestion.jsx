import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { HiCheck, HiUserAdd, HiStar } from "react-icons/hi";

const FollowSuggestion = ({ user, index, onFollow, variant = "default" }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFollow = async () => {
    setIsFollowing(true);
    await onFollow?.(user.id);

    setTimeout(() => setIsFollowing(false), 2000);
  };

  const variants = {
    default: "p-3 rounded-lg",
    compact: "p-2 rounded-md",
    featured: "p-4 rounded-xl border border-neutral-700/50",
  };

  return (
    <motion.div
      initial={{ x: 50, opacity: 0, scale: 0.95 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: -50, opacity: 0, scale: 0.95 }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className={`flex items-center gap-3 hover:bg-neutral-800/50 transition group cursor-pointer ${variants[variant]}`}
      whileHover={{
        x: 6,
        backgroundColor: "rgba(38, 38, 38, 0.7)",
        scale: 1.01,
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div className="relative">
        <motion.img
          src={user.avatar || "/default-avatar.png"}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-teal-400/50"
          whileHover={{
            scale: 1.15,
            rotate: [0, -5, 5, 0],
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        />

        {user.isOnline && (
          <motion.div
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: index * 0.1 + 0.3,
              type: "spring",
              stiffness: 400,
            }}
          />
        )}

        {user.isFeatured && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: index * 0.1 + 0.4,
              type: "spring",
              stiffness: 300,
            }}
          >
            <HiStar className="w-3 h-3 text-black" />
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="flex-1"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: index * 0.1 + 0.2,
          type: "spring",
          stiffness: 200,
        }}
      >
        <motion.h4
          className="text-white font-semibold text-sm leading-tight"
          whileHover={{ color: "#38bdf8" }}
        >
          {user.name}
        </motion.h4>
        <motion.p
          className="text-gray-400 text-xs"
          animate={{
            x: isHovered ? 2 : 0,
            color: isHovered ? "#94a3b8" : "#9ca3af",
          }}
        >
          @{user.username}
        </motion.p>

        {variant === "featured" && user.bio && (
          <motion.p
            className="text-gray-500 text-xs mt-1 line-clamp-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            {user.bio}
          </motion.p>
        )}

        {user.followersCount && (
          <motion.p
            className="text-teal-400 text-xs mt-1 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            {user.followersCount} followers
          </motion.p>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.button
          key={isFollowing ? "following" : "follow"}
          onClick={handleFollow}
          className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${
            isFollowing
              ? "bg-green-500 text-white"
              : "bg-teal-400 text-black hover:bg-teal-300"
          }`}
          whileHover={{
            scale: 1.05,
            y: -2,
            boxShadow: "0 4px 12px rgba(56, 178, 172, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <motion.div className="flex items-center gap-1">
            <AnimatePresence mode="wait">
              {isFollowing ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="flex items-center gap-1"
                >
                  <HiCheck className="w-4 h-4" />
                  <span>Following</span>
                </motion.div>
              ) : (
                <motion.div
                  key="add"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1"
                >
                  <HiUserAdd className="w-4 h-4" />
                  <span>Follow</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.button>
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        initial={false}
        animate={
          isFollowing
            ? {
                backgroundColor: [
                  "transparent",
                  "rgba(56, 178, 172, 0.1)",
                  "transparent",
                ],
                scale: [1, 1.05, 1],
              }
            : {}
        }
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
};

export default FollowSuggestion;
