import { useEffect, useState } from "react";
import { useUsers } from "../../store/usersStore";
import { useAuth } from "../../store/authStore";
import FollowSuggestion from "./FollowSuggestion";
import WhoToFollowDrawer from "./WhoToFollowDrawer";
import { motion } from "framer-motion";
import { HiUserGroup } from "react-icons/hi";

const WhoToFollow = () => {
  const { isAuthenticated } = useAuth();
  const { fetchSuggestions, suggestions, followUser } = useUsers();
  const [hide, setHide] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchSuggestions("trending");
  }, [fetchSuggestions]);

  if (hide) return null;

  if (!isAuthenticated) {
    return (
      <motion.div
        className="bg-gradient-to-br from-black/90 via-neutral-900/90 to-neutral-900/80 rounded-2xl shadow-lg border border-neutral-800 px-4 py-6 min-h-[400px] flex flex-col justify-center items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-4xl mb-4 select-none">👋</div>
        <h3 className="text-white text-lg font-bold mb-2 text-center">
          Want personalized suggestions?
        </h3>
        <div className="text-neutral-500 text-center mb-4">
          Login or register to see people you may want to follow!
        </div>
        <div className="flex gap-4">
          <motion.a
            href="/login"
            className="px-5 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-semibold rounded-full shadow hover:from-teal-500 hover:to-cyan-400 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Log In
          </motion.a>
          <motion.a
            href="/register"
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-500 text-white font-semibold rounded-full shadow hover:from-blue-500 hover:to-purple-400 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register
          </motion.a>
        </div>
      </motion.div>
    );
  }

  const handleFollow = async (userId) => {
    await followUser(userId);
    fetchSuggestions("trending");
  };

  return (
    <>
      <motion.div
        className="bg-gradient-to-br from-black/90 via-neutral-900/90 to-neutral-900/80 rounded-2xl shadow-lg border border-neutral-800 px-4 py-6 min-h-[400px] flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-2 flex-1">
          {suggestions && suggestions.length > 0 ? (
            <>
              {suggestions.slice(0, 4).map((user, index) => (
                <FollowSuggestion
                  key={user._id}
                  user={{
                    id: user._id,
                    name: user.fullName,
                    username: user.username,
                    avatar: user.avatar,
                    followersCount: user.followersCount,
                    isOnline: user.isOnline,
                    isFeatured: index === 0, 
                  }}
                  index={index}
                  variant="compact"
                  onFollow={handleFollow}
                />
              ))}

              {/* Bottom CTA */}
              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.a
                  href="/explore"
                  className="block w-full text-center text-teal-400 font-semibold py-2 hover:bg-neutral-800/30 rounded-lg bg-neutral-800/60 border border-teal-600/20 transition"
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(38, 38, 38, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore more people
                </motion.a>
              </motion.div>
            </>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center h-full py-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="text-4xl mb-4 select-none"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🎉
              </motion.div>
              <h3 className="text-white text-lg font-bold mb-2 text-center">
                You're following everyone!
              </h3>
              <p className="text-neutral-500 text-center mb-4 text-sm">
                Stay tuned — new people join every day.
              </p>
              <motion.a
                href="/explore"
                className="px-5 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-semibold rounded-full shadow hover:from-teal-500 hover:to-cyan-400 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Discover more people
              </motion.a>
            </motion.div>
          )}
        </div>
      </motion.div>

      <WhoToFollowDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <div className="space-y-3">
          {suggestions?.map((user, index) => (
            <FollowSuggestion
              key={user._id}
              user={{
                id: user._id,
                name: user.fullName,
                username: user.username,
                avatar: user.avatar,
                followersCount: user.followersCount,
                bio: user.bio,
                isOnline: user.isOnline,
                isFeatured: user.isFeatured,
              }}
              index={index}
              variant="default"
              onFollow={handleFollow}
            />
          ))}
        </div>
      </WhoToFollowDrawer>
    </>
  );
};

export default WhoToFollow;
