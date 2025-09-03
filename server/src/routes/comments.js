import express from "express";
import { body } from "express-validator";
import {
  getComments,
  createComment,
  updateComment,
  getTotalCommentCount,
  deleteComment,
  likeComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Validation rules
const commentValidation = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Comment must be between 1 and 1000 characters"),
  body("postId").isMongoId().withMessage("Valid post ID is required"),
];

const updateCommentValidation = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Comment must be between 1 and 1000 characters"),
];

// Routes
router.get("/:postId", getComments);
router.get("/count/:postId", getTotalCommentCount);
router.post("/", protect, commentValidation, createComment);
router.put("/:id", protect, updateCommentValidation, updateComment);
router.delete("/:id", protect, deleteComment);
router.put("/:id/like", protect, likeComment);

export default router;
