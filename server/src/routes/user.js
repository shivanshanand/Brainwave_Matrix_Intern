import express from "express";
import {
  followUser,
  unfollowUser,
  getSuggestions,
  getFollowers,
  getFollowing,
  getUserByUsername,
  updateProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/:id/follow", protect, followUser);
router.post("/:id/unfollow", protect, unfollowUser);

router.get("/suggestions", protect, getSuggestions);
router.get("/:id/followers", getFollowers);
router.get("/:id/following", getFollowing);
router.get("/username/:username", getUserByUsername);

router.put("/me", protect, updateProfile);

export default router;
