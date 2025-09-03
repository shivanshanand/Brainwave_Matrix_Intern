import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePosts } from "../../store/postStore";
import CommentForm from "../Comments/CommentForm";
import CommentsList from "../Comments/CommentsList";
import "prosemirror-view/style/prosemirror.css";
import {
  HiHeart,
  HiOutlineHeart,
  HiPencil,
  HiTrash,
  HiDotsVertical,
  HiEye,
  HiClock,
  HiShare,
  HiChevronLeft,
  HiUser,
} from "react-icons/hi";
import { toast } from "react-toastify";
import { usePostPermissions } from "../../hooks/useAuth";
import { useAuth } from "../../store/authStore";

const PostDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { post, fetchPost, loading, error, likePost, deletePost } = usePosts();
  const { user } = useAuth();
  const { canEdit, canDelete, isAuthor } = usePostPermissions(post);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [viewsCount, setViewsCount] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const contentRef = useRef(null);
  const actionsRef = useRef(null);

  // Calculate reading time
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const textContent = content?.replace(/<[^>]*>/g, "") || "";
    const wordCount = textContent.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const element = contentRef.current;
      const scrollTop = window.scrollY;
      const scrollHeight = element.scrollHeight;
      const clientHeight = window.innerHeight;
      const progress = Math.min(
        (scrollTop / (scrollHeight - clientHeight)) * 100,
        100
      );
      setReadingProgress(Math.max(0, progress));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [post]);

  useEffect(() => {
    if (slug) fetchPost(slug);
  }, [slug, fetchPost]);

  useEffect(() => {
    if (post) {
      const initialLikesCount =
        post.likesCount !== undefined
          ? post.likesCount
          : post.likes?.length || 0;
      setLikesCount(initialLikesCount);
      setViewsCount(post.views || 0);
      setEstimatedReadTime(calculateReadingTime(post.content));
      const userLiked =
        user &&
        Array.isArray(post.likes) &&
        post.likes.some(
          (like) => like.user === user._id || like.user?._id === user._id
        );

      setIsLiked(userLiked || false);
    }
  }, [post, user]);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActionsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLike = async () => {
    if (!post?._id || isLiking || !user) {
      if (!user) {
        toast.error("Please login to like posts");
        return;
      }
      return;
    }
    const prevLiked = isLiked;
    const prevCount = likesCount;
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiking(true);
    try {
      const response = await likePost(post._id);
      setIsLiked(response.liked);
      setLikesCount(response.likesCount);
      if (response.liked) {
        toast.success("Post liked! ❤️", { autoClose: 2000 });
      }
    } catch (err) {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error("Failed to like post. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!post?._id || isDeleting) return;
    setShowDeleteModal(true);
  };

  // New function to handle the actual deletion
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(post._id);
      toast.success("🗑️ Post deleted successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch {
      toast.error("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleEdit = () => {
    navigate(`/posts/${post.slug}/edit`);
    setShowActionsMenu(false);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt || `Check out this article: ${post.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard! 🔗");
      }
    } catch {
      toast.error("Failed to share. Please try again.");
    }
  };

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  // Action button component
  const ActionButtons = ({ isMobile = false }) => {
    const buttonClass = isMobile
      ? "flex items-center gap-3 px-4 py-3 w-full text-left transition-colors"
      : "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105";
    return (
      <>
        {canEdit && (
          <button
            onClick={handleEdit}
            className={`${buttonClass} ${
              isMobile
                ? "text-cyan-300 hover:bg-neutral-700"
                : "bg-cyan-700/20 text-cyan-300 hover:bg-cyan-700/30"
            }`}
          >
            <HiPencil className="w-4 h-4" />
            <span>Edit Post</span>
          </button>
        )}
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`${buttonClass} ${
              isMobile
                ? "text-red-300 hover:bg-red-900/30 disabled:opacity-50"
                : "bg-red-700/20 text-red-300 hover:bg-red-700/30 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiTrash className="w-4 h-4" />
            )}
            <span>{isDeleting ? "Deleting..." : "Delete Post"}</span>
          </button>
        )}
      </>
    );
  };

  // Loaders and error state
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-14 h-14 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-gray-400 font-medium">
            Loading amazing content...
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">😕</div>
          <h2 className="text-red-400 text-xl font-bold mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  if (!post) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="bg-neutral-800/50 rounded-2xl p-8 text-center max-w-md">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h2 className="text-gray-300 text-xl font-bold mb-2">
            Post Not Found
          </h2>
          <p className="text-gray-400 mb-4">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={goBack}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-neutral-900 z-50">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Back Button */}
      <div className="sticky top-4 left-4 z-40 pt-4 pl-4">
        <button
          onClick={goBack}
          className="bg-neutral-900/80 backdrop-blur-sm text-gray-300 hover:text-white hover:bg-neutral-800/80 p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
        >
          <HiChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <article
        ref={contentRef}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20"
      >
        {/* Header Section */}
        <header className="mb-12">
          {/* Categories */}
          {post.categories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map((category) => (
                <span
                  key={category._id}
                  className="bg-neutral-800 text-cyan-300 px-4 py-2 rounded-full text-sm font-semibold border border-cyan-500/10"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              {post.author?.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.username}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500/30"
                />
              ) : (
                <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center">
                  <HiUser className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <p
                  className={`font-semibold ${
                    isAuthor ? "text-cyan-300" : "text-gray-300"
                  }`}
                >
                  {post.author?.firstName && post.author?.lastName
                    ? `${post.author.firstName} ${post.author.lastName}`
                    : post.author?.username || "Anonymous"}
                  {isAuthor && (
                    <span className="ml-2 bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-full text-xs">
                      Author
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <HiClock className="w-4 h-4" />
                <span>{estimatedReadTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <HiEye className="w-4 h-4" />
                <span>{viewsCount.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-1">
                <HiHeart className="w-4 h-4 text-pink-400" />
                <span>{likesCount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons for Authors */}
          {(canEdit || canDelete) && (
            <div className="flex justify-end mb-6">
              <div className="relative" ref={actionsRef}>
                {/* Mobile Dropdown */}
                <div className="sm:hidden">
                  <button
                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                    className="bg-neutral-900/80 backdrop-blur-sm text-gray-300 hover:text-white p-3 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    <HiDotsVertical className="w-5 h-5" />
                  </button>
                  {showActionsMenu && (
                    <div className="absolute right-0 top-14 bg-neutral-900/95 backdrop-blur-sm rounded-xl shadow-2xl min-w-[180px] overflow-hidden border border-neutral-700">
                      <ActionButtons isMobile={true} />
                    </div>
                  )}
                </div>
                {/* Desktop Buttons */}
                <div className="hidden sm:flex gap-3">
                  <ActionButtons />
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-12 group">
            <div className="relative overflow-hidden rounded-2xl bg-neutral-900">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full max-h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        )}

        {/* Content */}
        <div
          className="editor-content mx-auto max-w-none mb-12 selection:bg-cyan-500/30 selection:text-cyan-200"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mb-12">
            <h3 className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-wider">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-neutral-900/70 text-gray-300 hover:bg-neutral-800 hover:text-white px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="sticky bottom-0 bg-neutral-900/80 backdrop-blur-sm border-t border-neutral-800 p-6 rounded-t-2xl mb-12">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                disabled={isLiking || !user}
                className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105 ${
                  isLiked
                    ? "bg-pink-600/20 border border-pink-500/30 text-pink-300"
                    : "bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-pink-400 border border-neutral-600"
                } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLiking ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isLiked ? (
                  <HiHeart className="w-5 h-5" />
                ) : (
                  <HiOutlineHeart className="w-5 h-5" />
                )}
                <span>
                  {isLiked ? "Liked" : "Like"} • {likesCount.toLocaleString()}
                </span>
              </button>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-600/30 transition-all duration-200 hover:scale-105 font-semibold"
            >
              <HiShare className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {post._id && (
          <section className="space-y-8">
            <div className="border-t border-neutral-800 pt-8">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-pink-500 rounded-full"></span>
                Comments
              </h2>
              <div className="space-y-6">
                <CommentForm postId={post._id} />
                <CommentsList postId={post._id} />
              </div>
            </div>
          </section>
        )}
      </article>

      {/* Delete Confirmation Modal */}
      {/* Enhanced Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900/95 backdrop-blur-sm border border-neutral-700 rounded-2xl p-8 text-center max-w-md w-full mx-4 animate-fadeinUp">
            {/* Icon */}
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiTrash className="w-10 h-10 text-red-400" />
            </div>

            {/* Title & Description */}
            <h3 className="text-white text-2xl font-bold mb-3">Delete Post</h3>
            <p className="text-gray-300 mb-2">
              Are you sure you want to delete
            </p>
            <p className="text-cyan-300 font-semibold mb-6 break-words">
              "{post.title}"?
            </p>
            <p className="text-red-300 text-sm mb-8">
              ⚠️ This action cannot be undone
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white border border-neutral-600 font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <HiTrash className="w-5 h-5" />
                    <span>Delete Forever</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
