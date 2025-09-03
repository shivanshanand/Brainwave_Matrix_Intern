import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { validationResult } from "express-validator";
import {
  emitNewComment,
  emitCommentUpdate,
  emitCommentDelete,
  emitCommentLike,
} from "../config/socket.js";

const getTotalCommentCount = async (req, res) => {
  try {
    const { postId } = req.params;
    // Count ALL comments for the post (including replies and top-level)
    const total = await Comment.countDocuments({
      post: postId,
      status: "active",
    });
    res.json({ total });
  } catch (e) {
    console.error("Comment count error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get top-level comments (no parent)
    const comments = await Comment.find({
      post: postId,
      parentComment: null,
      status: "active",
    })
      .populate("author", "username firstName lastName avatar")
      .populate({
        path: "replies",
        match: { status: "active" },
        populate: {
          path: "author",
          select: "username firstName lastName avatar",
        },
        options: { sort: { createdAt: 1 } },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({
      post: postId,
      parentComment: null,
      status: "active",
    });

    res.json({
      comments,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, postId, parentCommentId } = req.body;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if parent comment exists (if replying)
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
    }

    // Create comment
    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: postId,
      parentComment: parentCommentId || null,
    });

    // If it's a reply, add to parent's replies array
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id },
      });
    }

    // Populate comment data
    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "username firstName lastName avatar"
    );

    // Emit real-time event
    emitNewComment(postId, populatedComment);

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check ownership
    if (comment.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this comment" });
    }

    // Update comment
    comment.content = req.body.content;
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "username firstName lastName avatar"
    );

    // Emit real-time event
    emitCommentUpdate(comment.post, populatedComment);

    res.json(populatedComment);
  } catch (error) {
    console.error("Update comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check ownership or admin
    if (
      comment.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    // Soft delete - change status instead of removing
    comment.status = "deleted";
    await comment.save();

    // If it has a parent, remove from parent's replies
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: comment._id },
      });
    }

    // Emit real-time event
    emitCommentDelete(comment.post, comment._id);

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if already liked
    const likeIndex = comment.likes.findIndex(
      (like) => like.user.toString() === req.user._id.toString()
    );

    let liked;
    if (likeIndex > -1) {
      // Unlike
      comment.likes.splice(likeIndex, 1);
      liked = false;
    } else {
      // Like
      comment.likes.push({ user: req.user._id });
      liked = true;
    }

    await comment.save();

    // Emit real-time event
    emitCommentLike(
      comment.post,
      comment._id,
      req.user._id,
      liked,
      comment.likes.length
    );

    res.json({
      liked,
      likesCount: comment.likes.length,
    });
  } catch (error) {
    console.error("Like comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getComments,
  getTotalCommentCount,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
};
