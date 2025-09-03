import express from "express";
import {
  uploadAvatar,
  uploadPostCover,
  uploadPostImages,
  deleteImage,
} from "../controllers/uploadController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.use(protect);

// Avatar upload
router.post("/avatar", upload.single("avatar"), uploadAvatar);

// Post cover upload
router.post("/post-cover", upload.single("coverImage"), uploadPostCover);

// Multiple post images
router.post("/post-images", upload.array("images", 5), uploadPostImages);

// Delete image
router.delete("/:publicId", deleteImage);

export default router;
