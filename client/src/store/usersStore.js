import { create } from "zustand";
import API from "../api/axios";

export const useUsers = create((set, get) => ({
  followers: [],
  following: [],
  suggestions: [],
  loading: false,
  error: null,
  userProfile: null,

  setUserProfile: (userProfile) => set({ userProfile }),

  fetchUserByUsername: async (username) => {
    set({ loading: true, userProfile: null, followers: [], following: [] });
    try {
      const { data } = await API.get(`/users/username/${username}`);
      set({
        userProfile: data,
        followers: data.followers || [], // sync followers list for modal/UI
        following: data.following || [], // sync following list for modal/UI
        loading: false,
      });
    } catch (err) {
      set({ loading: false, userProfile: null, followers: [], following: [] });
      // Optionally: set({ error: err.response?.data?.message || "Error loading user" });
    }
  },

  fetchFollowers: async (userId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.get(`/users/${userId}/followers`);
      set({ followers: data, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Error fetching followers",
      });
    }
  },

  fetchFollowing: async (userId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.get(`/users/${userId}/following`);
      set({ following: data, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Error fetching following",
      });
    }
  },

  followUser: async (userId) => {
    try {
      await API.post(`/users/${userId}/follow`);
      // Optionally update following/followers list
    } catch (err) {
      set({ error: err.response?.data?.message || "Error following user" });
    }
  },

  unfollowUser: async (userId) => {
    try {
      await API.post(`/users/${userId}/unfollow`);
      // Optionally update following/followers list
    } catch (err) {
      set({ error: err.response?.data?.message || "Error unfollowing user" });
    }
  },

  fetchSuggestions: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.get("/users/suggestions");
      set({ suggestions: Array.isArray(data) ? data : [], loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Error fetching suggestions",
      });
    }
  },
}));
