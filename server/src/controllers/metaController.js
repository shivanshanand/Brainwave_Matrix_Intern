import Category from "../models/Category.js";
import keyword_extractor from "keyword-extractor";
import Post from "../models/Post.js";

export const suggestCategories = async (req, res) => {
  try {
    const { title = "", content = "", max = 4 } = req.body;
    const categories = await Category.find().select("name").lean();
    const catList = categories.map((c) => c.name.toLowerCase());
    const combined = (title + " " + content).substring(0, 5000);
    const userKeywords = keyword_extractor.extract(combined, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true,
    });
    // direct matches
    let matches = catList.filter((cat) => userKeywords.includes(cat));
    // If less than max, fuzzy match partials
    if (matches.length < max) {
      matches = [
        ...matches,
        ...catList.filter((cat) =>
          userKeywords.some((kw) => cat.includes(kw) || kw.includes(cat))
        ),
      ]
        .filter((v, i, self) => self.indexOf(v) === i)
        .slice(0, max);
    }
    res.json({ items: matches });
  } catch (err) {
    res.status(500).json({ message: "Could not suggest categories" });
  }
};

export const getTags = async (req, res) => {
  try {
    const { q = "" } = req.query;
    const pipeline = [
      { $unwind: "$tags" },
      { $project: { tag: { $toLower: "$tags" } } },
      { $match: { tag: { $ne: null, $ne: "" } } },
    ];
    if (q)
      pipeline.push({
        $match: { tag: { $regex: q, $options: "i" } },
      });
    pipeline.push(
      { $group: { _id: "$tag", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $limit: 24 },
      { $project: { name: "$_id", count: 1, _id: 0 } }
    );
    const agg = await Post.aggregate(pipeline);
    res.json({ items: agg.map((x) => x.name) });
  } catch (err) {
    res.status(500).json({ message: "Failed to load tags" });
  }
};

export const suggestTags = async (req, res) => {
  try {
    const { title = "", content = "", max = 8 } = req.body;
    // Use your existing extractor (could swap for ML service later)
    const combined = (title + " " + content).substring(0, 5000); // avoid massive input
    const all = keyword_extractor.extract(combined, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true,
    });
    // Only return the top N
    const tags = all
      .filter((t) => t.length >= 2 && t.length <= 40)
      .slice(0, max);
    res.json({ items: tags });
  } catch (err) {
    res.status(500).json({ message: "Could not suggest tags" });
  }
};

// GET /api/categories - returns parent categories for main filter
export const getParentCategories = async (req, res) => {
  try {
    const parentCategories = await Category.find({ isParent: true })
      .sort({ name: 1 })
      .select("name slug description")
      .lean();

    res.json({
      success: true,
      categories: parentCategories,
    });
  } catch (err) {
    console.error("Get parent categories error:", err);
    res.status(500).json({ message: "Failed to load parent categories" });
  }
};

// GET /api/categories/:parent - returns child categories for detailed filtering
export const getChildCategories = async (req, res) => {
  try {
    const { parent } = req.params;

    const childCategories = await Category.find({
      parent: parent,
      isParent: false,
    })
      .sort({ name: 1 })
      .select("name slug description parent")
      .lean();

    res.json({
      success: true,
      parent: parent,
      categories: childCategories,
    });
  } catch (err) {
    console.error("Get child categories error:", err);
    res.status(500).json({ message: "Failed to load child categories" });
  }
};

// getCategories for autocomplete/search
export const getCategories = async (req, res) => {
  try {
    const { q = "", type = "all" } = req.query;
    let filter = {};

    if (q) filter.name = { $regex: q, $options: "i" };

    // Filter by type: 'parent', 'child', or 'all'
    if (type === "parent") filter.isParent = true;
    if (type === "child") filter.isParent = false;

    const categories = await Category.find(filter)
      .sort({ name: 1 })
      .limit(20)
      .select("name slug description isParent parent")
      .lean();

    res.json({
      success: true,
      items: categories.map((cat) => ({
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        isParent: cat.isParent,
        parent: cat.parent,
      })),
    });
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ message: "Failed to load categories" });
  }
};
