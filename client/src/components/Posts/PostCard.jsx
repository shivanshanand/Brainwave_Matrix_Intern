import { useEffect } from "react";
import { Link } from "react-router-dom";
import { HiHeart, HiOutlineChatAlt2, HiEye } from "react-icons/hi";
import { useComments } from "../../store/commentStore";
import { motion } from "framer-motion";
import { useUsers } from "../../store/usersStore";

const PostCard = ({ post, viewMode = "grid", index = 0 }) => {
  const isGrid = viewMode !== "list";
  const {
    coverImage,
    title,
    slug,
    excerpt,
    content,
    author,
    categories,
    tags,
    createdAt,
    readTime,
    likes,
    likesCount,
    views,
    _id,
  } = post;

  const summary =
    excerpt ||
    (content
      ? content
          .replace(/<[^>]+>/g, "")
          .replace(/\s+/g, " ")
          .trim()
      : "");
  const avatar = author?.avatar;
  const authorName = author?.username || author?.firstName || "Anonymous";
  const postDate = new Date(createdAt).toLocaleDateString();

  const displayLikesCount =
    likesCount !== undefined ? likesCount : likes?.length ?? 0;

  const { fetchTotalComments, totalComments } = useComments();

  useEffect(() => {
    if (_id) fetchTotalComments(_id);
    // eslint-disable-next-line
  }, [_id]);

  const formatCount = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { type: "spring", stiffness: 320, damping: 22 },
      }}
      whileTap={{ scale: 0.98 }}
      className={`group bg-black border border-neutral-800 rounded-2xl overflow-hidden transition-all duration-200
        ${
          isGrid
            ? "flex flex-col h-[620px] min-h-[600px]"
            : "flex flex-col sm:flex-row h-auto sm:min-h-[240px] min-h-[280px]"
        }
        hover:shadow-xl hover:border-cyan-400/70`}
      style={{
        background: "linear-gradient(97deg, #151518 70%, #1b293a 120%)",
      }}
    >
      <Link
        to={`/posts/${slug}`}
        className={
          isGrid
            ? "w-full h-[260px] flex-shrink-0"
            : "w-full sm:w-72 md:w-80 lg:w-[22rem] h-48 sm:h-60 md:h-64 flex-shrink-0"
        }
        style={{ maxWidth: !isGrid ? "100vw" : undefined }}
      >
        <motion.div
          className="w-full h-full overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className={`w-full h-full object-cover ${
                isGrid
                  ? "rounded-t-2xl"
                  : "rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none"
              }`}
              loading="lazy"
              style={{
                minHeight: !isGrid ? "12rem" : undefined,
                maxHeight: !isGrid ? "20rem" : undefined,
              }}
            />
          ) : (
            <div
              className={`h-full w-full flex items-center justify-center bg-neutral-800 text-gray-400 font-medium text-sm select-none ${
                isGrid
                  ? "rounded-t-2xl"
                  : "rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none"
              }`}
            >
              No Image
            </div>
          )}
        </motion.div>
      </Link>

      <div
        className={`flex-1 flex flex-col min-w-0 ${
          isGrid ? "p-6 h-[360px]" : "p-5 sm:px-10 justify-between"
        }`}
      >
        <div className="flex-shrink-0">
          <div className="flex items-center flex-wrap gap-1.5 mb-3">
            {categories?.slice(0, isGrid ? 2 : 1).map((cat, index) => (
              <motion.span
                key={cat._id || cat.slug}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="rounded-full bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 px-2.5 py-1 text-xs text-teal-200 font-semibold cursor-pointer"
              >
                {cat.name}
              </motion.span>
            ))}
            {tags?.slice(0, isGrid ? 2 : 1).map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="rounded-full bg-neutral-800 px-2.5 py-1 text-xs text-white border border-gray-700 cursor-pointer"
              >
                #{tag}
              </motion.span>
            ))}
            <span className="text-xs text-gray-400 ml-auto flex-shrink-0">
              {postDate}
            </span>
          </div>

          <Link to={`/posts/${slug}`} className="block">
            <motion.h2
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
              className={`font-bold tracking-tight text-white hover:text-cyan-300 transition leading-tight mb-3 ${
                isGrid
                  ? "text-xl line-clamp-2 min-h-[3.5rem]"
                  : "text-lg sm:text-xl lg:text-2xl line-clamp-2"
              }`}
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
            >
              {title}
            </motion.h2>
          </Link>
        </div>

        <div
          className={isGrid ? "flex-1 flex flex-col min-h-0 mb-4" : "flex-1"}
        >
          <div
            className={`text-white/85 font-normal leading-relaxed ${
              isGrid
                ? "text-base line-clamp-3 min-h-[4.5rem]"
                : "text-sm sm:text-base line-clamp-3 mb-4"
            }`}
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
            }}
          >
            {summary}
          </div>
        </div>

        <div className="flex-shrink-0 mt-auto">
          <div className="flex items-center gap-3 mb-4">
            {avatar && (
              <motion.img
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                src={avatar}
                alt={authorName}
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-600 flex-shrink-0 cursor-pointer"
              />
            )}
            <span className="font-semibold text-white text-base truncate flex-1">
              {authorName}
            </span>
            <span className="text-gray-400 flex items-center gap-1.5 text-sm flex-shrink-0 font-medium">
              <svg
                viewBox="0 0 20 20"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                className="inline text-gray-400"
              >
                <circle cx="10" cy="10" r="8" strokeWidth="1.5" />
                <path d="M10 6v4l2 2" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {readTime || "5"}min read
            </span>
          </div>

          <div className="border-t border-neutral-700/80 mb-4" />

          <div className="flex items-center justify-between text-white/90 font-medium">
            <div className="flex items-center gap-4">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 hover:text-pink-300 transition cursor-pointer group"
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <HiHeart className="inline-block text-pink-400 w-5 h-5" />
                </motion.div>
                <span className="text-base font-semibold">
                  {formatCount(displayLikesCount)}
                </span>
              </motion.span>

              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 hover:text-cyan-300 transition cursor-pointer group"
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <HiOutlineChatAlt2 className="inline-block text-cyan-400 w-5 h-5" />
                </motion.div>
                <span className="text-base font-semibold">
                  {formatCount(totalComments[_id] ?? 0)}
                </span>
              </motion.span>

              {views > 0 && (
                <span className="flex items-center gap-2 text-gray-400 group">
                  <HiEye className="inline-block w-5 h-5" />
                  <span className="text-sm font-medium">
                    {formatCount(views)}
                  </span>
                </span>
              )}
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={`/posts/${slug}`}
                className={`rounded-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold transition-all duration-200 flex-shrink-0 shadow-lg hover:shadow-cyan-500/25 ${
                  isGrid
                    ? "px-5 py-2.5 text-sm"
                    : "px-4 py-2 text-xs sm:text-sm sm:px-5"
                }`}
                tabIndex={0}
                aria-label={`Read more about ${title}`}
              >
                {isGrid ? "Read Article →" : "Read →"}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
