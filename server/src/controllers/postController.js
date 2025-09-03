import Post from "../models/Post.js";
import Category from "../models/Category.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import User from "../models/User.js";

const getPosts = async (req, res) => {
  try {
    console.log("🔍 Backend received query:", req.query);
    console.log("📋 Categories param:", req.query.categories);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const {
      status = "all",
      categories,
      author,
      search,
      sortBy = "createdAt",
      order = "desc",
      tag,
      seoKeyword,
    } = req.query;

    console.log("🔍 Received categories:", categories);

    let filter = {};
    if (status !== "all") filter.status = status;
    if (author) filter.author = author;

    if (author) {
      let authorDoc = null;
      if (mongoose.Types.ObjectId.isValid(author)) {
        authorDoc = await User.findById(author);
      }
      if (!authorDoc) {
        authorDoc = await User.findOne({ username: author });
      }
      if (authorDoc) filter.author = authorDoc._id;
      else filter.author = null; // No posts will match
    }

    // ✅ ENHANCED MULTIPLE CATEGORY FILTERING
    if (categories && categories.trim()) {
      const categoryArray = categories
        .split(",")
        .map((cat) => cat.trim())
        .filter(Boolean);
      console.log("📋 Category array:", categoryArray);

      let allCategoryIds = new Set(); // Use Set to avoid duplicates

      for (const categorySlug of categoryArray) {
        console.log(`🔍 Processing category: ${categorySlug}`);

        // Check if it's a parent category
        const parentCategory = await Category.findOne({
          slug: categorySlug,
          isParent: true,
        });

        if (parentCategory) {
          console.log(`👨‍👩‍👧‍👦 Found parent category: ${categorySlug}`);

          // Get all child categories for this parent
          const childCategories = await Category.find({
            parent: categorySlug,
            isParent: false,
          }).select("_id");

          console.log(
            `👶 Child categories for ${categorySlug}:`,
            childCategories.length
          );

          // Add child category IDs
          childCategories.forEach((cat) =>
            allCategoryIds.add(cat._id.toString())
          );

          // Also include the parent category itself if it has posts
          allCategoryIds.add(parentCategory._id.toString());
        } else {
          // Handle child category or direct slug
          const categoryDoc = await Category.findOne({ slug: categorySlug });
          if (categoryDoc) {
            console.log(`👶 Found child/direct category: ${categorySlug}`);
            allCategoryIds.add(categoryDoc._id.toString());
          } else {
            console.log(`❌ Category not found: ${categorySlug}`);
          }
        }
      }

      // Convert Set back to array and apply filter
      const categoryFilterArray = Array.from(allCategoryIds);
      console.log(
        "🎯 Final category filter IDs:",
        categoryFilterArray.length,
        "categories"
      );

      if (categoryFilterArray.length > 0) {
        filter.categories = { $in: categoryFilterArray };
      }
    }

    if (tag) filter.tags = { $in: [tag.trim().toLowerCase()] };
    if (seoKeyword)
      filter.seoKeywords = { $in: [seoKeyword.trim().toLowerCase()] };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    console.log("🔍 Final MongoDB filter:", JSON.stringify(filter, null, 2));

    // ✅ FIXED SORTING - Handle likes array properly
    let posts;

    if (sortBy === "likes") {
      // Use aggregation pipeline for likes sorting (array length)
      const sortOrder = order === "desc" ? -1 : 1;

      const aggregationPipeline = [
        { $match: filter },
        {
          $addFields: {
            likesCount: { $size: "$likes" },
          },
        },
        { $sort: { likesCount: sortOrder, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
            pipeline: [
              {
                $project: {
                  username: 1,
                  firstName: 1,
                  lastName: 1,
                  avatar: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "categories",
            foreignField: "_id",
            as: "categories",
            pipeline: [
              {
                $project: {
                  name: 1,
                  slug: 1,
                  description: 1,
                  isParent: 1,
                  parent: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$author",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            content: 0, // Exclude content field
          },
        },
      ];

      posts = await Post.aggregate(aggregationPipeline);
    } else {
      // Regular sorting for other fields
      const sortOrder = order === "desc" ? -1 : 1;
      let sortObj = {};
      sortObj[sortBy] = sortOrder;

      // Add secondary sort for consistency
      if (sortBy !== "createdAt") {
        sortObj.createdAt = -1;
      }

      posts = await Post.find(filter)
        .populate("author", "username firstName lastName avatar")
        .populate("categories", "name slug description isParent parent")
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .select("-content");
    }

    const total = await Post.countDocuments(filter);

    // ✅ Add likesCount to each post for frontend display
    const postsWithLikesCount = posts.map((post) => {
      const postObj = post.toObject ? post.toObject() : post;
      return {
        ...postObj,
        likesCount: postObj.likes ? postObj.likes.length : 0,
      };
    });

    console.log(
      `📊 Found ${total} posts matching filter, returning ${posts.length} for page ${page}`
    );
    console.log(`🔍 Sorting by: ${sortBy}, Order: ${order}`);

    res.json({
      posts: postsWithLikesCount,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        limit,
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("❌ Get posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPost = async (req, res) => {
  try {
    let post;
    if (mongoose.Types.ObjectId.isValid(req.params.slug)) {
      post = await Post.findById(req.params.slug)
        .populate("author", "username firstName lastName avatar bio")
        .populate("categories", "name slug description isParent parent");
    } else {
      post = await Post.findOne({ slug: req.params.slug })
        .populate("author", "username firstName lastName avatar bio")
        .populate("categories", "name slug description isParent parent");
    }

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Increment views
    await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });

    // Add likesCount to the response
    const postObj = post.toObject();
    postObj.likesCount = postObj.likes ? postObj.likes.length : 0;

    res.json(postObj);
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const {
      title,
      content,
      excerpt,
      categories, // Array of category ids (strings)
      tags,
      status,
      coverImage,
      seoTitle,
      seoDescription,
      seoKeywords,
    } = req.body;

    // Validate all categories exist
    let categoryIds = categories?.filter(Boolean) || [];
    if (categoryIds.length) {
      const catDocs = await Category.find({ _id: { $in: categoryIds } });
      if (catDocs.length !== categoryIds.length)
        return res.status(400).json({ message: "Invalid categories selected" });
    }

    let normTags = (tags || [])
      .filter(Boolean)
      .map((t) => t.trim().toLowerCase())
      .filter((t, idx, arr) => t && arr.indexOf(t) === idx);

    const post = await Post.create({
      title,
      content,
      excerpt,
      categories: categoryIds,
      tags: normTags,
      status: status || "published",
      coverImage: coverImage || "",
      author: req.user._id,
      seoTitle,
      seoDescription,
      seoKeywords: seoKeywords || [],
    });

    const populatedPost = await Post.findById(post._id)
      .populate("author", "username firstName lastName avatar")
      .populate("categories", "name slug description isParent parent");

    // Add likesCount to response
    const postObj = populatedPost.toObject();
    postObj.likesCount = postObj.likes ? postObj.likes.length : 0;

    res.status(201).json(postObj);
  } catch (error) {
    console.error("Create post error:", error);
    if (error.code === 11000) {
      res
        .status(400)
        .json({ message: "Post with similar title already exists" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};

const updatePost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    const updateData = { ...req.body };

    // Check for duplicate (same title but different _id)
    if (updateData.title) {
      const duplicate = await Post.findOne({
        title: updateData.title,
        _id: { $ne: req.params.id },
      });
      if (duplicate) {
        return res
          .status(400)
          .json({ message: "Post with similar title already exists" });
      }
    }

    if (updateData.categories && updateData.categories.length) {
      const catDocs = await Category.find({
        _id: { $in: updateData.categories },
      });
      if (catDocs.length !== updateData.categories.length)
        return res.status(400).json({ message: "Invalid categories selected" });
    }

    if (updateData.tags)
      updateData.tags = updateData.tags
        .filter(Boolean)
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag, idx, arr) => tag && arr.indexOf(tag) === idx);

    if (updateData.seoKeywords)
      updateData.seoKeywords = updateData.seoKeywords
        .filter(Boolean)
        .map((kw) => kw.trim().toLowerCase())
        .filter((kw, idx, arr) => kw && arr.indexOf(kw) === idx);

    post = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("author", "username firstName lastName avatar")
      .populate("categories", "name slug description isParent parent");

    // Add likesCount to response
    const postObj = post.toObject();
    postObj.likesCount = postObj.likes ? postObj.likes.length : 0;

    res.json(postObj);
  } catch (error) {
    console.error("Update post error:", error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Post with similar title already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const likeIndex = post.likes.findIndex(
      (like) => like.user.toString() === req.user._id.toString()
    );

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1); // Unlike
    } else {
      post.likes.push({ user: req.user._id }); // Like
    }

    await post.save();

    res.json({
      liked: likeIndex === -1,
      likesCount: post.likes.length,
      likes: post.likes,
    });
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getFeaturedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ featured: true, status: "published" })
      .sort({ publishedAt: -1 })
      .populate("author", "username avatar")
      .populate("categories", "name slug");

    const postsWithLikesCount = posts.map((post) => {
      const postObj = post.toObject();
      return {
        ...postObj,
        likesCount: postObj.likes ? postObj.likes.length : 0,
      };
    });

    res.json({
      posts: postsWithLikesCount,
      pagination: null, // keep consistent with getPosts
    });
  } catch (e) {
    console.error("Get featured posts error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

const getTrendingPosts = async (req, res) => {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    let posts = await Post.find({
      publishedAt: { $gte: since },
      status: "published",
    })
      .sort({ views: -1 })
      .limit(12)
      .populate("author", "username avatar")
      .populate("categories", "name slug");

    if (posts.length < 12) {
      const excludeIds = posts.map((p) => p._id);
      const morePosts = await Post.find({
        _id: { $nin: excludeIds },
        status: "published",
      })
        .sort({ views: -1 })
        .limit(12 - posts.length)
        .populate("author", "username avatar")
        .populate("categories", "name slug");
      posts = posts.concat(morePosts);
    }

    const postsWithLikesCount = posts.map((post) => {
      const postObj = post.toObject();
      return {
        ...postObj,
        likesCount: postObj.likes ? postObj.likes.length : 0,
      };
    });

    res.json({
      posts: postsWithLikesCount,
      pagination: null, // consistency
    });
  } catch (e) {
    console.error("Get trending posts error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getFeaturedPosts,
  getTrendingPosts,
};
