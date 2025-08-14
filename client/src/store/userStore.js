// src/store/userStore.js
import { create } from "zustand";
import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL : "";
const API = BASE_URL;

axios.defaults.withCredentials = true;

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,
  isGuest: true,

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

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        name,
        email,
        password,
      });
      set({
        user: res.data.user,
        isGuest: false,
        loading: false,
        error: null,
      });
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Registration failed!!";
      set({
        error: errorMsg,
        loading: false,
        isGuest: true,
      });
      throw new Error(errorMsg);
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true });
      set({
        user: null,
        isGuest: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        user: null,
        isGuest: true,
        loading: false,
        error: null,
      });
    }
  },

  checkSession: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API}/api/auth/me`);
      set({
        user: res.data.user,
        isGuest: false,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        user: null,
        isGuest: true,
        loading: false,
        error: null,
      });
    }
  },

  setGuestMode: (isGuest = true) => {
    if (isGuest) {
      set({
        user: null,
        isGuest: true,
        error: null,
      });
    }
  },

  clearError: () => set({ error: null }),

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
