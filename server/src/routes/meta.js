import express from "express";
import {
  getCategories,
  getParentCategories,
  getChildCategories,
  getTags,
  suggestTags,
  suggestCategories,
} from "../controllers/metaController.js";

const router = express.Router();

// Enhanced category routes
router.get("/categories", getCategories); 
router.get("/categories/parents", getParentCategories); 
router.get("/categories/parent/:parent", getChildCategories); 
router.get("/tags", getTags);
router.post("/suggest-tags", suggestTags);
router.post("/suggest-categories", suggestCategories);

export default router;
