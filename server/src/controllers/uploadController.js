import {
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
} from "../config/cloudinary.js";
import User from "../models/User.js";

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Delete old avatar if exists
    const user = await User.findById(req.user._id);
    if (user.avatar) {
      const oldPublicId = getPublicIdFromUrl(user.avatar);
      if (oldPublicId) await deleteFromCloudinary(oldPublicId);
    }

    // Upload new avatar
    const result = await uploadToCloudinary(req.file.buffer, "blog/avatars");

    // Update user avatar
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: result.secure_url },
      { new: true }
    ).select("-password");

    res.json({
      message: "Avatar uploaded successfully",
      avatar: result.secure_url,
      publicId: result.public_id,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({ message: "Server error during avatar upload" });
  }
};

const uploadPostCover = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await uploadToCloudinary(req.file.buffer, "blog/posts");

    res.json({
      message: "Cover image uploaded successfully",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Post cover upload error:", error);
    res.status(500).json({ message: "Server error during cover upload" });
  }
};

const uploadPostImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No files uploaded" });

    const uploads = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer, "blog/posts"))
    );

    res.json({
      message: "Images uploaded successfully",
      images: uploads.map((u) => ({
        url: u.secure_url,
        publicId: u.public_id,
      })),
    });
  } catch (error) {
    console.error("Post images upload error:", error);
    res.status(500).json({ message: "Server error during images upload" });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    if (!publicId)
      return res.status(400).json({ message: "Public ID required" });

    const result = await deleteFromCloudinary(publicId);

    if (result.result === "ok") {
      res.json({ message: "Image deleted successfully" });
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({ message: "Server error during image deletion" });
  }
};

export { uploadAvatar, uploadPostCover, uploadPostImages, deleteImage };
