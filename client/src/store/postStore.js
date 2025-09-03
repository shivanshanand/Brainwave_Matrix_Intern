import { create } from "zustand";
import API from "../api/axios";

export const usePosts = create((set, get) => ({
  posts: [],
  post: null,
  loading: false,
  error: null,
  pagination: null,

  selectedCategories: [],
  currentFilters: {
    search: "",
    sortBy: "createdAt",
    order: "desc",
    tag: null,
    status: "all",
  },

  fetchPosts: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.get("/posts", { params });
      set({
        posts: Array.isArray(data.posts) ? data.posts : [],
        pagination: data.pagination,
        loading: false,
      });
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Error fetching posts",
      });
      throw err;
    }
  },

  fetchPostsByAuthor: async (authorUsernameOrId, params = {}) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.get("/posts", {
        params: { ...params, author: authorUsernameOrId },
      });
      set({
        posts: Array.isArray(data.posts) ? data.posts : [],
        pagination: data.pagination,
        loading: false,
      });
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Error fetching user's posts",
      });
      throw err;
    }
  },

  filterByCategories: async (categorySlugArray) => {
    set({ loading: true, selectedCategories: categorySlugArray });
    try {
      const params = {
        categories: categorySlugArray.join(","),
        ...get().currentFilters,
      };
      const { data } = await API.get("/posts", { params });

      set({
        posts: Array.isArray(data.posts) ? data.posts : [],
        pagination: data.pagination,
        loading: false,
      });
    } catch (err) {
      console.error("❌ Filter error:", err);
      set({
        loading: false,
        error: err.response?.data?.message || "Error filtering posts",
      });
    }
  },

  toggleCategoryFilter: async (categorySlug) => {
    const { selectedCategories } = get();
    let newCategories;

    if (selectedCategories.includes(categorySlug)) {
      // Remove category if already selected
      newCategories = selectedCategories.filter((cat) => cat !== categorySlug);
    } else {
      // Add category if not selected
      newCategories = [...selectedCategories, categorySlug];
    }

    if (newCategories.length === 0) {
      // If no categories selected, show all posts
      get().clearFilters();
    } else {
      await get().filterByCategories(newCategories);
    }
  },

  updateFilters: async (newFilters) => {
    const filters = { ...get().currentFilters, ...newFilters };
    set({ currentFilters: filters, loading: true });

    try {
      const params = {
        ...filters,
        categories: get().selectedCategories.join(","),
      };
      const { data } = await API.get("/posts", { params });

      set({
        posts: Array.isArray(data.posts) ? data.posts : [],
        pagination: data.pagination,
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Error updating filters",
      });
    }
  },

  clearFilters: () => {
    set({
      selectedCategories: [], // Clear selected categories
      currentFilters: {
        search: "",
        sortBy: "createdAt",
        order: "desc",
        tag: null,
        status: "all",
      },
    });
    get().fetchPosts();
  },

  fetchPost: async (slug) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.get(`/posts/${slug}`);
      set({ post: data, loading: false });
    } catch (err) {
      set({
        post: null,
        loading: false,
        error: err.response?.data?.message || "Error fetching post",
      });
    }
  },

  createPost: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.post("/posts", payload);
      set((state) => ({
        posts: [data, ...state.posts],
        loading: false,
      }));
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Error creating post",
      });
      throw err;
    }
  },

  updatePost: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.put(`/posts/${id}`, payload);
      set((state) => ({
        posts: state.posts.map((p) => (p._id === id ? data : p)),
        post: state.post?._id === id ? data : state.post,
        loading: false,
      }));
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Error updating post",
      });
      throw err;
    }
  },

  deletePost: async (id) => {
    set({ loading: true, error: null });
    try {
      await API.delete(`/posts/${id}`);
      set((state) => ({
        posts: state.posts.filter((p) => p._id !== id),
        loading: false,
      }));
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Error deleting post",
      });
      throw err;
    }
  },

  likePost: async (id) => {
    try {
      const { data } = await API.put(`/posts/${id}/like`);
      set((state) => ({
        posts: state.posts.map((p) =>
          p._id === id ? { ...p, likes: data.likesCount } : p
        ),
        post:
          state.post?._id === id
            ? { ...state.post, likes: data.likesCount }
            : state.post,
      }));
      return data;
    } catch (err) {
      console.error("Error liking post:", err);
      throw err;
    }
  },

  fetchFeaturedPosts: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.get("/posts/featured");
      set({
        posts: Array.isArray(data.posts) ? data.posts : [],
        pagination: data.pagination,
        loading: false,
      });
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Error fetching featured posts",
      });
      throw err;
    }
  },

  fetchTrendingPosts: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.get("/posts/trending");
      set({
        posts: Array.isArray(data.posts) ? data.posts : [],
        pagination: data.pagination,
        loading: false,
      });
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Error fetching trending posts",
      });
      throw err;
    }
  },
}));
