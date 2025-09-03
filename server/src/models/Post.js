// models/Post.js
import mongoose from "mongoose";
import keyword_extractor from "keyword-extractor";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      maxlength: 300,
    },
    coverImage: {
      type: String,
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    // ✅ Moved validation to schema level
    tags: {
      type: [String],
      validate: [(arr) => arr.length <= 8, "No more than 8 tags"],
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    views: {
      type: Number,
      default: 0,
      index: true,
    },
    readTime: {
      type: Number, // in minutes
      default: 1,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],
  },
  {
    timestamps: true,
  }
);

// ✅ Add validation for categories length
postSchema.path("categories").validate(function (categories) {
  return categories.length <= 4;
}, "No more than 4 categories allowed");

// ✅ Add validation for tags content
postSchema.path("tags").validate(function (tags) {
  return tags.every((tag) => tag.length >= 2 && tag.length <= 40);
}, "Tags must be 2-40 characters long");

postSchema.pre("validate", function (next) {
  // Always slugify if not present (validation will pass!)
  if (!this.slug || this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  if (!this.seoTitle) this.seoTitle = this.title;
  if (!this.seoDescription)
    this.seoDescription = this.excerpt || this.content?.slice(0, 160);

  if (this.isModified("content")) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }

  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }

  next();
});

const extractKeywords = (content) => {
  return keyword_extractor.extract(content, {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  });
};

postSchema.pre("validate", function (next) {
  if (!this.seoKeywords || this.seoKeywords.length === 0) {
    const content = this.title + " " + this.content;
    this.seoKeywords = extractKeywords(content).slice(0, 6); // top 6
  }
  next();
});

// ✅ Fixed pre-save hook - only clean string arrays
postSchema.pre("save", function (next) {
  const cleanStringArray = (arr) =>
    arr
      .filter(Boolean)
      .map((i) => i.trim().toLowerCase())
      .filter((i, idx, a) => i && a.indexOf(i) === idx);

  // ✅ Only clean string arrays, not ObjectId arrays
  if (this.tags) this.tags = cleanStringArray(this.tags);
  if (this.seoKeywords) this.seoKeywords = cleanStringArray(this.seoKeywords);

  next();
});

// ✅ ENHANCED INDEXES for better performance
postSchema.index({ author: 1, status: 1 });
postSchema.index({ slug: 1 });
postSchema.index({ categories: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ updatedAt: -1 });
postSchema.index({ publishedAt: -1 });
postSchema.index({ views: -1 }); // For most viewed sorting
postSchema.index({ featured: 1, publishedAt: -1 }); // For featured posts
postSchema.index({ status: 1, publishedAt: -1 }); // For published posts

// ✅ Compound indexes for common queries
postSchema.index({ status: 1, categories: 1, createdAt: -1 });
postSchema.index({ status: 1, author: 1, createdAt: -1 });

// ✅ Text index for search functionality
postSchema.index(
  {
    title: "text",
    content: "text",
    tags: "text",
  },
  {
    weights: {
      title: 10,
      tags: 5,
      content: 1,
    },
  }
);

// ✅ Virtual field for likes count (optional, for easier access)
postSchema.virtual("likesCount").get(function () {
  return this.likes ? this.likes.length : 0;
});

// ✅ Ensure virtual fields are serialized
postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

const Post = mongoose.model("Post", postSchema);
export default Post;
