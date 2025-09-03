import User from "../models/User.js";

// Get user by username (public profile, NO password or sensitive data)
export const getUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    // Populate followers and following (just username/avatar/id for privacy/performance)
    const user = await User.findOne({ username })
      .select(
        "-password -emailVerificationToken -resetPasswordToken -resetPasswordExpire"
      )
      .populate("followers", "username avatar firstName lastName")
      .populate("following", "username avatar firstName lastName")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Construct fullName for response (virtuals not included in .lean() by default)
    user.fullName = `${user.firstName} ${user.lastName}`;

    // Optionally, add counts for quick UI access
    user.followersCount = user.followers?.length || 0;
    user.followingCount = user.following?.length || 0;

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Follow a user
export const followUser = async (req, res) => {
  const userId = req.user._id;
  const targetUserId = req.params.id;

  if (userId.toString() === targetUserId) {
    return res.status(400).json({ message: "You cannot follow yourself." });
  }

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    // Already following?
    if (user.following.includes(targetUserId)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    user.following.push(targetUserId);
    targetUser.followers.push(userId);

    await user.save();
    await targetUser.save();

    res.json({ message: `You are now following ${targetUser.username}` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  const userId = req.user._id;
  const targetUserId = req.params.id;

  if (userId.toString() === targetUserId) {
    return res.status(400).json({ message: "You cannot unfollow yourself." });
  }

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    user.following = user.following.filter(
      (id) => id.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== userId.toString()
    );

    await user.save();
    await targetUser.save();

    res.json({ message: `You have unfollowed ${targetUser.username}` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get suggestions
export const getSuggestions = async (req, res) => {
  const userId = req.user._id;
  try {
    // Find current user with following populated
    const user = await User.findById(userId).populate("following");
    const excludeIds = [userId, ...user.following.map((u) => u._id)];

    // First, get users who have written posts (priority suggestions)
    const usersWithPosts = await User.aggregate([
      { $match: { _id: { $nin: excludeIds } } },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "author",
          as: "posts",
        },
      },
      { $match: { "posts.0": { $exists: true } } }, // Only users with at least 1 post
      { $addFields: { postCount: { $size: "$posts" } } },
      { $sort: { postCount: -1, createdAt: -1 } }, // Users with more posts first
      { $limit: 8 },
      {
        $project: {
          username: 1,
          avatar: 1,
          firstName: 1,
          lastName: 1,
          bio: 1,
          followers: 1,
          following: 1,
          createdAt: 1,
          isVerified: 1,
          postCount: 1,
        },
      },
    ]);

    // If we need more suggestions, add users without posts
    let allSuggestions = usersWithPosts;

    if (usersWithPosts.length < 10) {
      const usersWithoutPosts = await User.find({
        _id: {
          $nin: [...excludeIds, ...usersWithPosts.map((u) => u._id)],
        },
      })
        .limit(10 - usersWithPosts.length)
        .select(
          "username avatar firstName lastName bio followers following createdAt isVerified"
        )
        .sort({ createdAt: -1 });

      allSuggestions = [...usersWithPosts, ...usersWithoutPosts];
    }

    // Populate followers/following for all suggestions
    const populatedSuggestions = await User.populate(allSuggestions, [
      { path: "followers", select: "_id username firstName lastName avatar" },
      { path: "following", select: "_id username firstName lastName avatar" },
    ]);

    res.json(populatedSuggestions);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const updates = {};
    const { username, bio, avatar } = req.body;

    if (username && username !== req.user.username) {
      const userWithSame = await User.findOne({ username });
      if (
        userWithSame &&
        userWithSame._id.toString() !== req.user._id.toString()
      ) {
        return res.status(400).json({ message: "Username already taken" });
      }
      updates.username = username;
    }

    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

// Get followers
export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followers",
      "username avatar firstName lastName"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.followers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get following
export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "following",
      "username avatar firstName lastName"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.following);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
