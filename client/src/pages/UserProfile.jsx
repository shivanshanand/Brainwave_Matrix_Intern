import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  HiUsers,
  HiUserAdd,
  HiUserRemove,
  HiSparkles,
  HiX,
  HiLocationMarker,
  HiCalendar,
  HiPencil,
} from "react-icons/hi";
import { useAuth } from "../store/authStore";
import { useUsers } from "../store/usersStore";
import { usePosts } from "../store/postStore";
import { toast } from "react-toastify";
import Navbar from "../components/Common/Navbar";
import PostCard from "../components/Posts/PostCard";
import SimpleFooter from "../components/Common/SimpleFooter";
import EditProfileModal from "../components/Common/EditProfileModal ";
import { motion } from "framer-motion";

const UserListModal = ({ isOpen, onClose, title, users = [], onUserClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-neutral-900/95 to-neutral-800/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md border border-neutral-700/50 max-h-[70vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-700/50">
          <h4 className="text-xl font-bold text-white">{title}</h4>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors p-1 hover:bg-neutral-800 rounded-full"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* User List */}
        <div className="overflow-y-auto max-h-96 p-2">
          {users.length > 0 ? (
            <div className="space-y-1">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => onUserClick(user.username)}
                  className="flex items-center gap-3 p-3 hover:bg-neutral-800/50 rounded-xl transition-all duration-200 cursor-pointer group"
                >
                  <div className="relative">
                    <img
                      src={user.avatar || "/default-avatar.png"}
                      className="w-12 h-12 rounded-full object-cover border-2 border-neutral-700 group-hover:border-teal-400 transition-colors"
                      alt={user.fullName || user.firstName}
                    />
                    {user.isVerified && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1">
                        <HiSparkles className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium group-hover:text-teal-300 transition-colors truncate">
                      {user.fullName ||
                        `${user.firstName} ${user.lastName || ""}`.trim()}
                    </p>
                    <p className="text-neutral-400 text-sm truncate">
                      @{user.username}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-neutral-400">
              <HiUsers className="w-12 h-12 mb-3 text-neutral-600" />
              <p>No {title.toLowerCase()} yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const {
    fetchUserByUsername,
    followUser,
    unfollowUser,
    userProfile,
    setUserProfile,
    loading,
  } = useUsers();
  const { posts, fetchPostsByAuthor } = usePosts();

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch profile, followers, following, and posts on mount or username change
  useEffect(() => {
    if (username) {
      fetchUserByUsername(username);
      fetchPostsByAuthor(username);
    }
  }, [username, fetchUserByUsername, fetchPostsByAuthor]);

  const isMe = currentUser?._id === userProfile?._id;
  const isFollowing =
    userProfile && userProfile.followers
      ? userProfile.followers.some((u) => u._id === currentUser?._id)
      : false;

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error("Please login to follow users");
      navigate("/login");
      return;
    }
    setFollowLoading(true);
    try {
      await followUser(userProfile._id);
      // Optimistically update UI:
      setUserProfile({
        ...userProfile,
        followers: [
          ...userProfile.followers,
          { _id: currentUser._id, ...currentUser },
        ],
      });
      toast.success(`You are now following ${userProfile.username}`);
    } catch (error) {
      toast.error("Failed to follow user");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setFollowLoading(true);
    try {
      await unfollowUser(userProfile._id);
      // Optimistically update UI:
      setUserProfile({
        ...userProfile,
        followers: userProfile.followers.filter(
          (u) => u._id !== currentUser._id
        ),
      });
      toast.success(`You unfollowed @${userProfile.username}`);
    } catch (error) {
      toast.error("Failed to unfollow user");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUserClick = (clickedUsername) => {
    setShowFollowers(false);
    setShowFollowing(false);
    navigate(`/users/${clickedUsername}`);
  };

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count?.toString() || "0";
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="mt-20 min-h-screen bg-black flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-neutral-800 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-teal-400 rounded-full animate-spin"></div>
          </div>
        </div>
      </>
    );
  }

  if (!userProfile) {
    return (
      <>
        <Navbar />
        <div className="mt-20 min-h-screen bg-black flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center mb-6 border border-neutral-800">
            <HiUsers className="w-12 h-12 text-neutral-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">User not found</h2>
          <p className="text-neutral-400 mb-6">
            The user @{username} doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/explore")}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            Explore People
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mt-16 sm:mt-20 min-h-screen bg-black">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/50 via-black to-neutral-900/30"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 backdrop-blur-xl rounded-2xl border border-neutral-700/50 p-6 sm:p-8 shadow-2xl mb-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={userProfile.avatar || "/default-avatar.png"}
                  alt={`${
                    userProfile.fullName || userProfile.firstName
                  }'s avatar`}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-teal-400 shadow-xl object-cover"
                />
                {userProfile.isVerified && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
                    <HiSparkles className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-4">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    {userProfile.fullName ||
                      `${userProfile.firstName} ${
                        userProfile.lastName || ""
                      }`.trim()}
                  </h1>
                  <p className="text-xl text-teal-400 font-medium mb-3">
                    @{userProfile.username}
                  </p>

                  {userProfile.bio && (
                    <p className="text-neutral-300 text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                      {userProfile.bio}
                    </p>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6 text-neutral-400">
                  {userProfile.location && (
                    <div className="flex items-center gap-1">
                      <HiLocationMarker className="w-4 h-4" />
                      <span className="text-sm">{userProfile.location}</span>
                    </div>
                  )}
                  {userProfile.createdAt && (
                    <div className="flex items-center gap-1">
                      <HiCalendar className="w-4 h-4" />
                      <span className="text-sm">
                        Joined {formatDate(userProfile.createdAt)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Stats and Actions */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                  {/* Stats */}
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => setShowFollowing(true)}
                      className="group flex items-center gap-2 hover:bg-neutral-800/50 px-3 py-2 rounded-lg transition-all"
                    >
                      <span className="text-white font-bold text-lg">
                        {formatCount(userProfile.following?.length || 0)}
                      </span>
                      <span className="text-neutral-400 group-hover:text-neutral-300">
                        Following
                      </span>
                    </button>

                    <button
                      onClick={() => setShowFollowers(true)}
                      className="group flex items-center gap-2 hover:bg-neutral-800/50 px-3 py-2 rounded-lg transition-all"
                    >
                      <span className="text-white font-bold text-lg">
                        {formatCount(userProfile.followers?.length || 0)}
                      </span>
                      <span className="text-neutral-400 group-hover:text-neutral-300">
                        Followers
                      </span>
                    </button>
                  </div>

                  {/* Edit Profile Button (for own profile) */}
                  {isMe && (
                    <motion.button
                      onClick={() => setShowEditModal(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neutral-700 to-neutral-600 hover:from-neutral-600 hover:to-neutral-500 text-white rounded-xl font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <HiPencil className="w-5 h-5" />
                      <span>Edit Profile</span>
                    </motion.button>
                  )}

                  {/* Follow/Unfollow Button */}
                  {!isMe && (
                    <button
                      onClick={isFollowing ? handleUnfollow : handleFollow}
                      disabled={followLoading}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg min-w-[120px] justify-center ${
                        isFollowing
                          ? "bg-neutral-700 text-white hover:bg-red-600 border border-neutral-600 hover:border-red-500"
                          : "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-teal-500/30"
                      } ${
                        followLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {followLoading ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : isFollowing ? (
                        <>
                          <HiUserRemove className="w-5 h-5" />
                          <span>Unfollow</span>
                        </>
                      ) : (
                        <>
                          <HiUserAdd className="w-5 h-5" />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span>
              {isMe
                ? "Your Posts"
                : `${userProfile.fullName || userProfile.firstName}'s Posts`}
            </span>
            {posts?.length > 0 && (
              <span className="text-neutral-500 text-lg">({posts.length})</span>
            )}
          </h2>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-neutral-800 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-teal-400 rounded-full animate-spin"></div>
              </div>
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-14 mb-12 px-2 sm:px-8 lg:px-12 xl:px-20">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mb-6 border border-neutral-800">
                <HiUsers className="w-10 h-10 text-neutral-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {isMe ? "You haven't posted anything yet" : "No posts yet"}
              </h3>
              <p className="text-neutral-400 text-center max-w-md">
                {isMe
                  ? "Share your thoughts and ideas with the world!"
                  : `${
                      userProfile.fullName || userProfile.firstName
                    } hasn't shared any posts yet.`}
              </p>
              {isMe && (
                <button
                  onClick={() => navigate("/create-post")}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  Create Your First Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <UserListModal
        isOpen={showFollowers}
        onClose={() => setShowFollowers(false)}
        title="Followers"
        users={userProfile?.followers || []}
        onUserClick={handleUserClick}
      />

      <UserListModal
        isOpen={showFollowing}
        onClose={() => setShowFollowing(false)}
        title="Following"
        users={userProfile?.following || []}
        onUserClick={handleUserClick}
      />

      <EditProfileModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
      />

      <SimpleFooter />
    </>
  );
};

export default UserProfile;
