import { create } from "zustand";
import { persist } from "zustand/middleware";
import API from "../api/axios";

export const useAuth = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      initialize: async () => {
        if (get().loading) return;
        set({ loading: true, error: null });
        try {
          const { data } = await API.get("/auth/profile");
          set({
            user: data,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (err) {
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        }
      },

      fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
          const { data } = await API.get("/auth/profile");
          set({ user: data, loading: false, isAuthenticated: true });
          return data;
        } catch (err) {
          set({
            user: null,
            loading: false,
            error: err.response?.data?.message || "Error fetching profile",
            isAuthenticated: false,
          });
          throw err;
        }
      },

      login: async (payload) => {
        set({ loading: true, error: null });
        try {
          const { data } = await API.post("/auth/login", payload);

          set({
            user: data,
            loading: false,
            error: null,
            isAuthenticated: true,
          });

          return data;
        } catch (err) {
          set({
            loading: false,
            error: err.response?.data?.message || "Login error",
            isAuthenticated: false,
          });
          throw err;
        }
      },

      register: async (payload) => {
        set({ loading: true, error: null });
        try {
          const { data } = await API.post("/auth/register", payload);

          set({
            user: data,
            loading: false,
            error: null,
            isAuthenticated: true,
          });

          return data;
        } catch (err) {
          set({
            loading: false,
            error: err.response?.data?.message || "Register error",
            isAuthenticated: false,
          });
          throw err;
        }
      },

      updateUser: async (userData) => {
        try {
          const { data } = await API.put("/users/me", userData);
          set({ user: data });
          return data;
        } catch (err) {
          set({
            error: err.response?.data?.message || "Error updating profile",
          });
          throw err;
        }
      },

      logout: async () => {
        try {
          await API.post("/auth/logout");
        } catch (err) {
          console.error("Logout error:", err.message);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            loading: false,
          });
        }
      },

      setUser: (user) => set({ user }),
      clearError: () => set({ error: null }),

      // Authorization helpers
      isAuthor: (authorId) => {
        const { user } = get();
        return user && user._id === authorId;
      },

      hasRole: (role) => {
        const { user } = get();
        return user && user.role === role;
      },

      isAdmin: () => {
        const { user } = get();
        return user && user.role === "admin";
      },

      canEditPost: (post) => {
        const { user } = get();
        if (!user || !post) return false;
        return (
          user._id === post.author._id ||
          user._id === post.author ||
          user.role === "admin"
        );
      },

      canDeletePost: (post) => {
        const { user } = get();
        if (!user || !post) return false;
        return (
          user._id === post.author._id ||
          user._id === post.author ||
          user.role === "admin"
        );
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
