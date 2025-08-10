import { create } from "zustand";
import axios from "axios";
import { generateInsights } from "../utils/generateInsights";

const BASE_URL =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL : "";

const API = BASE_URL;

axios.defaults.withCredentials = true;

export const useExpenseStore = create((set, get) => ({
  expenses: [],
  insights: null,
  loading: false,
  error: null,
  isGuest: false,

  fetchExpenses: async () => {
    set({ loading: true, error: null });
    try {
      if (get().isGuest) {
        const guestData = JSON.parse(
          localStorage.getItem("guestExpenses") || "[]"
        );
        const insights = generateInsights(guestData);
        set({ expenses: guestData, insights, loading: false });
      } else {
        const res = await axios.get(`${API}/api/expenses`, {
          withCredentials: true,
        });
        set({
          expenses: res.data.expenses,
          insights: res.data.insights,
          loading: false,
        });
      }
    } catch (err) {
      set({
        error: err.response?.data?.msg || "Failed to load expenses",
        loading: false,
      });
    }
  },

  addExpense: async (data) => {
    set({ loading: true, error: null });
    try {
      if (get().isGuest) {
        let guestExpenses = JSON.parse(
          localStorage.getItem("guestExpenses") || "[]"
        );

        // Ensure consistent data structure
        const newExpense = {
          _id: Date.now().toString(), // Generate temporary ID
          ...data,
          date: data.date || new Date().toISOString(),
        };

        guestExpenses.unshift(newExpense);
        localStorage.setItem("guestExpenses", JSON.stringify(guestExpenses));

        // Generate fresh insights
        const insights = generateInsights(guestExpenses);
        set({ expenses: guestExpenses, insights, loading: false });
      } else {
        // Add to backend
        await axios.post(`${API}/api/expenses`, data, {
          withCredentials: true,
        });

        // Force refresh to get updated data with insights
        await get().fetchExpenses();
      }
    } catch (err) {
      console.error("Add expense error:", err);
      set({
        error: err.response?.data?.msg || "Add failed",
        loading: false,
      });
      throw err; // Re-throw so modal can handle the error
    }
  },

  deleteExpense: async (id) => {
    set({ loading: true, error: null });
    try {
      if (get().isGuest) {
        let guestExpenses = get().expenses.filter((e) => e._id !== id);
        localStorage.setItem("guestExpenses", JSON.stringify(guestExpenses));
        set({ expenses: guestExpenses, loading: false });
      } else {
        await axios.delete(`${API}/api/expenses/${id}`, {
          withCredentials: true,
        });
        get().fetchExpenses();
      }
    } catch (err) {
      set({
        error: err.response?.data?.msg || "Delete failed",
        loading: false,
      });
    }
  },

  setGuestMode: (isGuest) => set({ isGuest }),
}));
