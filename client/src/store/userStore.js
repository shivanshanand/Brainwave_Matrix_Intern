// src/store/userStore.js
import { create } from "zustand";
import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL : "/";
const API = BASE_URL;

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,
  isGuest: true, // Default to guest mode

  // Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(
        `${API}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      // Update both user and guest status
      set({
        user: res.data.user,
        isGuest: false, // User is now authenticated
        loading: false,
        error: null,
      });
      return { success: true };
    } catch (err) {
      const errorMsg =
        err.response?.data?.msg || "Login failed. Check credentials!!";
      set({
        error: errorMsg,
        loading: false,
        isGuest: true, // Ensure guest status on login failure
      });
      throw new Error(errorMsg);
    }
  },

  // Register
  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(
        `${API}/api/auth/register`,
        { name, email, password },
        { withCredentials: true }
      );
      // Update both user and guest status after successful registration
      set({
        user: res.data.user,
        isGuest: false, // User is now authenticated
        loading: false,
        error: null,
      });
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Registration failed!!";
      set({
        error: errorMsg,
        loading: false,
        isGuest: true, // Ensure guest status on registration failure
      });
      throw new Error(errorMsg);
    }
  },

  // Logout
  logout: async () => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true });
      set({
        user: null,
        isGuest: true, // Reset to guest mode
        loading: false,
        error: null,
      });
    } catch (error) {
      // Even if logout fails on backend, clear user locally
      set({
        user: null,
        isGuest: true, // Reset to guest mode
        loading: false,
        error: null,
      });
    }
  },

  // Check session on mount (your existing function, enhanced)
  checkSession: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API}/api/auth/me`, {
        withCredentials: true,
      });
      // User is authenticated
      set({
        user: res.data.user,
        isGuest: false, // User has valid session
        loading: false,
        error: null,
      });
    } catch (error) {
      // No valid session, user is guest
      set({
        user: null,
        isGuest: true, // User is guest
        loading: false,
        error: null,
      });
    }
  },

  // Helper method to set guest mode manually (if needed)
  setGuestMode: (isGuest = true) => {
    if (isGuest) {
      set({
        user: null,
        isGuest: true,
        error: null,
      });
    }
  },

  // Clear error messages
  clearError: () => set({ error: null }),

  // Get current auth status
  getAuthStatus: () => {
    const state = get();
    return {
      isAuthenticated: !!state.user && !state.isGuest,
      isGuest: state.isGuest,
      user: state.user,
      loading: state.loading,
    };
  },
}));
