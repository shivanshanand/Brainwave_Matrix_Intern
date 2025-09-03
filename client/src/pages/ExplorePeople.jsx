// ExplorePeople.jsx
import {
  HiUserGroup,
  HiSparkles,
  HiUserAdd,
  HiSearch,
  HiCheck,
} from "react-icons/hi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUsers } from "../store/usersStore";
import { useAuth } from "../store/authStore";
import Navbar from "../components/Common/Navbar";
import SimpleFooter from "../components/Common/SimpleFooter";

const UserCard = ({
  user,
  index,
  isFollowed,
  onFollow,
  onUnfollow,
  onUserClick,
  followLoading,
}) => {
  const [imageError, setImageError] = useState(false);

  const formatFollowers = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count?.toString() || "0";
  };

  const handleCardClick = (e) => {
    if (e.target.closest("[data-no-navigate]")) {
      return;
    }
    onUserClick(user.username);
  };

  const handleFollowClick = (e) => {
    e.stopPropagation();
    if (isFollowed) {
      onUnfollow(user._id, user.username);
    } else {
      onFollow(user._id, user.username);
    }
  };

  return (
    <div
      className="group bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-xl rounded-2xl border border-neutral-700/50 p-6 hover:border-teal-400/50 transition-all duration-300 hover:transform hover:scale-[1.02] shadow-xl hover:shadow-2xl cursor-pointer animate-fadeInUp opacity-0"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: "forwards",
      }}
      onClick={handleCardClick}
    >
      {/* Header with Avatar and Follow Button */}
      <div className="flex items-start justify-between mb-4">
        <div className="relative">
          <img
            src={
              imageError
                ? "/default-avatar.png"
                : user.avatar || "/default-avatar.png"
            }
            onError={() => setImageError(true)}
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-2 border-neutral-700 group-hover:border-teal-400 transition-all duration-300 shadow-lg"
            alt={`${user.firstName}'s avatar`}
          />
          {user.isVerified && (
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1.5">
              <HiSparkles className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Follow Button - Top Right */}
        <button
          data-no-navigate="true"
          className={`px-3 py-2 sm:px-4 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-md min-w-[80px] sm:min-w-[90px] flex items-center justify-center gap-1.5 ${
            isFollowed
              ? "bg-neutral-700 text-white hover:bg-neutral-600 border border-neutral-600"
              : "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-teal-500/20"
          } ${followLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          onClick={handleFollowClick}
          disabled={followLoading}
        >
          {followLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isFollowed ? (
            <>
              <HiCheck className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Following</span>
              <span className="sm:hidden">✓</span>
            </>
          ) : (
            <>
              <HiUserAdd className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Follow</span>
            </>
          )}
        </button>
      </div>

      {/* User Info */}
      <div className="mb-4">
        <div className="mb-2">
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-teal-300 transition-colors leading-tight">
            {user.firstName} {user.lastName || ""}
          </h3>
          <p className="text-teal-400 text-sm font-medium">@{user.username}</p>
        </div>

        {/* Bio */}
        <p className="text-neutral-300 text-sm leading-relaxed line-clamp-2 group-hover:text-neutral-100 transition-colors">
          {user.bio || "No bio available"}
        </p>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-800/50">
        <div className="flex items-center gap-3 sm:gap-4">
          <div>
            <span className="text-white font-bold text-sm">
              {formatFollowers(user.followers?.length ?? 0)}
            </span>
            <span className="text-neutral-400 text-xs ml-1">followers</span>
          </div>

          <div>
            <span className="text-white font-bold text-sm">
              {formatFollowers(user.following?.length ?? 0)}
            </span>
            <span className="text-neutral-400 text-xs ml-1">following</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center gap-2">
          {user.createdAt &&
            (() => {
              const isNewUser =
                new Date() - new Date(user.createdAt) <
                30 * 24 * 60 * 60 * 1000;
              return isNewUser ? (
                <span className="px-2 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs rounded-full font-medium">
                  New
                </span>
              ) : null;
            })()}
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

const ExplorePeople = () => {
  const {
    fetchSuggestions,
    suggestions = [],
    followUser,
    unfollowUser,
    
    loading,
  } = useUsers();

  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [followLoading, setFollowLoading] = useState(new Set());

  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];

  // Fetch suggestions on component mount
  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  // Initialize followed users when suggestions load
  useEffect(() => {
    if (suggestions.length > 0 && currentUser) {
      const initialFollowed = new Set();
      suggestions.forEach((user) => {
        if (
          user.followers?.some(
            (f) => f._id === currentUser._id || f === currentUser._id
          )
        ) {
          initialFollowed.add(user._id);
        }
      });
      setFollowedUsers(initialFollowed);
    }
  }, [suggestions, currentUser]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        setTimeout(() => setIsSearching(false), 300);
      } else {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleFollow = async (userId, username) => {
    if (!currentUser) {
      toast.error("Please login to follow users");
      navigate("/login");
      return;
    }

    setFollowLoading((prev) => new Set([...prev, userId]));
    try {
      await followUser(userId);
      setFollowedUsers((prev) => new Set([...prev, userId]));
      toast.success(`You are now following @${username}`);
    } catch (error) {
      toast.error("Failed to follow user");
      console.error("Follow error:", error);
    } finally {
      setFollowLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleUnfollow = async (userId, username) => {
    setFollowLoading((prev) => new Set([...prev, userId]));
    try {
      await unfollowUser(userId);
      setFollowedUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      toast.success(`You unfollowed @${username}`);
    } catch (error) {
      toast.error("Failed to unfollow user");
      console.error("Unfollow error:", error);
    } finally {
      setFollowLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleUserClick = (username) => {
    navigate(`/users/${username}`);
  };

  // Filter suggestions based on search term
  const filteredSuggestions = safeSuggestions.filter(
    (user) =>
      searchTerm.trim() === "" ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="mt-16 sm:mt-20 min-h-screen bg-black">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/50 via-black to-neutral-900/30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16">
          {/* Hero Section */}
          <header className="text-center mb-8 sm:mb-12">
            <div className="relative inline-block mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-full flex items-center justify-center border border-neutral-700 shadow-xl">
                <HiUserGroup className="w-8 h-8 sm:w-10 sm:h-10 text-teal-400" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Discover People
            </h1>
            <p className="text-base sm:text-lg text-neutral-400 max-w-3xl mx-auto leading-relaxed px-4">
              Connect with brilliant minds, innovative creators, and inspiring
              voices from around the world
            </p>
          </header>

          {/* Search Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="relative max-w-2xl mx-auto">
              <HiSearch
                className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
                  isSearching
                    ? "text-teal-400 animate-pulse"
                    : "text-neutral-500"
                }`}
              />
              <input
                className="w-full pl-10 sm:pl-12 pr-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20 text-base sm:text-lg transition-all disabled:opacity-50"
                placeholder="Search people by name, username, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
              {isSearching && (
                <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-400"></div>
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          {searchTerm.trim() && (
            <div className="mb-6 sm:mb-8 text-center">
              <p className="text-neutral-400 text-sm">
                <span className="text-white font-semibold">
                  {filteredSuggestions.length}
                </span>
                {filteredSuggestions.length === 1 ? "person" : "people"} found
                {searchTerm.trim() && (
                  <span className="text-teal-400 ml-2">for "{searchTerm}"</span>
                )}
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-neutral-800 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-4 border-transparent border-t-teal-400 rounded-full animate-spin"></div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredSuggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              {searchTerm.trim() ? (
                <>
                  <h3 className="text-2xl font-bold text-white mb-2 text-center">
                    No people found
                  </h3>
                  <p className="text-neutral-400 text-center mb-6 max-w-md">
                    No people match "{searchTerm}".
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-teal-500/30"
                  >
                    Clear Search
                  </button>
                </>
              ) : (
                <>
                  {/* Fun animated emoji */}
                  <div className="text-6xl animate-bounce-slow mb-4 select-none">
                    🎉
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">
                    You’re following everyone!
                  </h3>
                  <p className="text-neutral-400 text-center mb-6 max-w-md">
                    You’ve connected with every account.
                    <br />
                    Come back soon—new people join every day!
                  </p>
                  <a
                    href="/"
                    className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-teal-500/30"
                  >
                    Go back home
                  </a>
                  <style jsx>{`
                    .animate-bounce-slow {
                      animation: bounce 1.4s infinite
                        cubic-bezier(0.3, 0.52, 0.54, 0.95);
                    }
                    @keyframes bounce {
                      0%,
                      100% {
                        transform: translateY(0);
                      }
                      25%,
                      75% {
                        transform: translateY(-0.5rem);
                      }
                      50% {
                        transform: translateY(-2rem);
                      }
                    }
                  `}</style>
                </>
              )}
            </div>
          ) : (
            /* Users Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredSuggestions.map((user, index) => (
                <UserCard
                  key={user._id}
                  user={user}
                  index={index}
                  isFollowed={followedUsers.has(user._id)}
                  onFollow={handleFollow}
                  onUnfollow={handleUnfollow}
                  onUserClick={handleUserClick}
                  followLoading={followLoading.has(user._id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Custom animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeInUp {
            animation: fadeInUp 0.4s ease-out forwards;
          }

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
      <SimpleFooter />
    </>
  );
};

export default ExplorePeople;
