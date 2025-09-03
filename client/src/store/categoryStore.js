// src/store/categoryStore.js
import { create } from "zustand";
import API from "../api/axios";

export const useCategories = create((set, get) => ({
  parentCategories: [],
  childCategories: {},
  allCategories: [],
  loading: false,
  error: null,

  // Fetch parent categories for main filter
  fetchParentCategories: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.get("/meta/categories/parents");
      set({
        parentCategories: data.categories,
        loading: false,
      });
      return data.categories;
    } catch (err) {
      set({
        loading: false,
        error:
          err.response?.data?.message || "Error fetching parent categories",
      });
      throw err;
    }
  },

  // Fetch child categories for a parent
  fetchChildCategories: async (parentSlug) => {
    set({ loading: true });
    try {
      const { data } = await API.get(`/meta/categories/parent/${parentSlug}`);
      set((state) => ({
        childCategories: {
          ...state.childCategories,
          [parentSlug]: data.categories,
        },
        loading: false,
      }));
      return data.categories;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Error fetching child categories",
      });
      throw err;
    }
  },

  // Fetch all categories for autocomplete
  fetchAllCategories: async (query = "", type = "all") => {
    try {
      const { data } = await API.get("/meta/categories", {
        params: { q: query, type },
      });
      set({ allCategories: data.items });
      return data.items;
    } catch (err) {
      console.error("Error fetching categories:", err);
      return [];
    }
  },

  // Get child categories from cache or fetch
  getChildCategories: async (parentSlug) => {
    const { childCategories } = get();
    if (childCategories[parentSlug]) {
      return childCategories[parentSlug];
    }
    return await get().fetchChildCategories(parentSlug);
  },

  // Clear cache
  clearCache: () => {
    set({ childCategories: {}, allCategories: [] });
  },
}));
