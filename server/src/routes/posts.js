import express from "express";
import { body } from "express-validator";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getTrendingPosts,
  getFeaturedPosts,
} from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Validation rules
const postValidation = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("content").trim().notEmpty().withMessage("Content is required"),
  body("excerpt")
    .optional()
    .isLength({ max: 300 })
    .withMessage("Excerpt must be less than 300 characters"),
];

// Routes
router.get("/trending", getTrendingPosts);
router.get("/featured", getFeaturedPosts);
router.get("/", getPosts);
router.get("/:slug", getPost);
router.post("/", protect, postValidation, createPost);
router.put("/:id", protect, postValidation, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:id/like", protect, likePost);

export default router;
