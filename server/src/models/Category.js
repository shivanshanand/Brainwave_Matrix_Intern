// models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 40,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    icon: {
      type: String,
    },
    isParent: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: String, 
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Index for better performance on parent-child queries
categorySchema.index({ isParent: 1, parent: 1 });

const Category = mongoose.model("Category", categorySchema);
export default Category;
