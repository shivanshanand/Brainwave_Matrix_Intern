import { create } from "zustand";
import API from "../api/axios";
import { useAuth } from "./authStore";

export const useComments = create((set) => ({
  comments: [],
  loading: false,
  error: null,
  totalComments: {},

  fetchComments: async (postId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.get(`/comments/${postId}`);
      set({ comments: data.comments, loading: false });
      return data; // in case you want to process pagination/total for detail page
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Error fetching comments",
      });
    }
  },

  fetchTotalComments: async (postId) => {
    try {
      const { data } = await API.get(`/comments/count/${postId}`);
      set((state) => ({
        totalComments: {
          ...state.totalComments,
          [postId]: data?.total ?? 0,
        },
      }));
      return data?.total ?? 0;
    } catch (err) {
      set((state) => ({
        totalComments: {
          ...state.totalComments,
          [postId]: 0,
        },
      }));
      return 0;
    }
  },

  addComment: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.post("/comments", payload);
      set((state) => ({ comments: [data, ...state.comments], loading: false }));
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Error adding comment",
      });
      throw err;
    }
  },

  updateComment: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.put(`/comments/${id}`, payload);
      set((state) => ({
        comments: state.comments.map((c) => (c._id === id ? data : c)),
        loading: false,
      }));
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Error updating comment",
      });
      throw err;
    }
  },

  deleteComment: async (id) => {
    set({ loading: true, error: null });
    try {
      await API.delete(`/comments/${id}`);
      set((state) => ({
        comments: state.comments.filter((c) => c._id !== id),
        loading: false,
      }));
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Error deleting comment",
      });
      throw err;
    }
  },

  likeComment: async (id) => {
    const { user } = useAuth.getState(); // Make sure useAuth is imported here!
    const { data } = await API.put(`/comments/${id}/like`);
    set((state) => ({
      comments: state.comments.map((c) => {
        if (c._id !== id) return c;
        let newLikes = Array.isArray(c.likes) ? [...c.likes] : [];
        const idx = newLikes.findIndex((l) => (l.user || l) === user._id);
        if (idx > -1) {
          newLikes.splice(idx, 1);
        } else {
          newLikes.push({ user: user._id });
        }
        return { ...c, likes: newLikes };
      }),
    }));
    return data;
  },
}));
