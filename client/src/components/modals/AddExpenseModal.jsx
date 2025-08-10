import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  DollarSign,
  Calendar,
  Tag,
  FileText,
  Plus,
  Minus,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useExpenseStore } from "../../store/expenseStore";
import { toast } from "react-toastify";

const AddExpenseModal = ({ isOpen, onClose }) => {
  const { addExpense, loading } = useExpenseStore();

  // Form state
  const [formData, setFormData] = useState({
    type: "expense", // 'expense' or 'income'
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  // Predefined categories
  const expenseCategories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Groceries",
    "Fuel",
    "Other",
  ];

  const incomeCategories = [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Gift",
    "Bonus",
    "Other",
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });
      setErrors({});
      setCustomCategory("");
      setShowCustomCategory(false);
    }
  }, [isOpen]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!formData.category && !customCategory) {
      newErrors.category = "Please select or enter a category";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please enter a description";
    }

    if (!formData.date) {
      newErrors.date = "Please select a date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form", {
        icon: "⚠️",
      });
      return;
    }

    const finalCategory = customCategory || formData.category;

    // Fix the field mapping to match your backend
    const expenseData = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: finalCategory,
      note: formData.description, // Backend expects 'note', not 'description'
      date: new Date(formData.date).toISOString(),
      // Add notes field if your backend supports it
      ...(formData.notes && { notes: formData.notes }),
    };

    try {
      await addExpense(expenseData);
      toast.success(
        `${
          formData.type === "expense" ? "Expense" : "Income"
        } added successfully! 🎉`,
        {
          icon: formData.type === "expense" ? "💸" : "💰",
        }
      );
      onClose();
    } catch (error) {
      console.error("Add expense error:", error);
      toast.error("Failed to add entry. Please try again.", {
        icon: "❌",
      });
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const currentCategories =
    formData.type === "expense" ? expenseCategories : incomeCategories;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal - Fixed height with scroll */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md max-h-[90vh] bg-[#121214] border border-[#26262B] rounded-2xl shadow-[0_1px_0_rgba(255,255,255,0.04),0_12px_32px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          >
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-6 border-b border-[#26262B] bg-[#121214] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-500 text-black grid place-items-center">
                  {formData.type === "expense" ? (
                    <Minus className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </div>
                <h2 className="text-xl font-bold text-[#EDEDEF]">
                  Add {formData.type === "expense" ? "Expense" : "Income"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg hover:bg-[#1E1E22] text-[#8A8A92] hover:text-[#EDEDEF] transition-colors grid place-items-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Type Toggle */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#B3B3B8]">
                    Type
                  </label>
                  <div className="flex rounded-xl bg-[#0B0B0C] border border-[#26262B] p-1">
                    <button
                      type="button"
                      onClick={() => handleInputChange("type", "expense")}
                      className={`flex-1 h-9 rounded-lg font-medium text-sm transition-all ${
                        formData.type === "expense"
                          ? "bg-rose-500 text-white shadow-sm"
                          : "text-[#8A8A92] hover:text-[#EDEDEF] hover:bg-[#1E1E22]"
                      }`}
                    >
                      <Minus className="w-4 h-4 inline mr-2" />
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange("type", "income")}
                      className={`flex-1 h-9 rounded-lg font-medium text-sm transition-all ${
                        formData.type === "income"
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "text-[#8A8A92] hover:text-[#EDEDEF] hover:bg-[#1E1E22]"
                      }`}
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Income
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#B3B3B8]">
                    Amount *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A6A72]">
                      <span className="text-sm font-medium">₹</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) =>
                        handleInputChange("amount", e.target.value)
                      }
                      className={`w-full h-11 pl-8 pr-4 rounded-xl bg-[#121214] border text-[#EDEDEF] placeholder:text-[#6A6A72] focus:outline-none focus:ring-2 transition-all ${
                        errors.amount
                          ? "border-rose-500 focus:ring-rose-300/40"
                          : "border-[#2B2B31] focus:ring-cyan-300/40 focus:border-cyan-500"
                      }`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.amount}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#B3B3B8]">
                    Category *
                  </label>
                  {!showCustomCategory ? (
                    <div className="space-y-2">
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          handleInputChange("category", e.target.value)
                        }
                        className={`w-full h-11 px-4 rounded-xl bg-[#121214] border text-[#EDEDEF] focus:outline-none focus:ring-2 transition-all ${
                          errors.category
                            ? "border-rose-500 focus:ring-rose-300/40"
                            : "border-[#2B2B31] focus:ring-cyan-300/40 focus:border-cyan-500"
                        }`}
                      >
                        <option value="">Select a category</option>
                        {currentCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowCustomCategory(true)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        + Add custom category
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Enter custom category"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className={`w-full h-11 px-4 rounded-xl bg-[#121214] border text-[#EDEDEF] placeholder:text-[#6A6A72] focus:outline-none focus:ring-2 transition-all ${
                          errors.category
                            ? "border-rose-500 focus:ring-rose-300/40"
                            : "border-[#2B2B31] focus:ring-cyan-300/40 focus:border-cyan-500"
                        }`}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomCategory(false);
                          setCustomCategory("");
                        }}
                        className="text-xs text-[#8A8A92] hover:text-[#EDEDEF] transition-colors"
                      >
                        ← Back to predefined categories
                      </button>
                    </div>
                  )}
                  {errors.category && (
                    <p className="text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#B3B3B8]">
                    Description *
                  </label>
                  <input
                    type="text"
                    placeholder={`What was this ${formData.type} for?`}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className={`w-full h-11 px-4 rounded-xl bg-[#121214] border text-[#EDEDEF] placeholder:text-[#6A6A72] focus:outline-none focus:ring-2 transition-all ${
                      errors.description
                        ? "border-rose-500 focus:ring-rose-300/40"
                        : "border-[#2B2B31] focus:ring-cyan-300/40 focus:border-cyan-500"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#B3B3B8]">
                    Date *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A6A72]">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                      className={`w-full h-11 pl-10 pr-4 rounded-xl bg-[#121214] border text-[#EDEDEF] focus:outline-none focus:ring-2 transition-all ${
                        errors.date
                          ? "border-rose-500 focus:ring-rose-300/40"
                          : "border-[#2B2B31] focus:ring-cyan-300/40 focus:border-cyan-500"
                      }`}
                    />
                  </div>
                  {errors.date && (
                    <p className="text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Notes (Optional) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#B3B3B8]">
                    Notes <span className="text-[#6A6A72]">(optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-[#6A6A72]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Add any additional notes..."
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#121214] border border-[#2B2B31] text-[#EDEDEF] placeholder:text-[#6A6A72] focus:outline-none focus:ring-2 focus:ring-cyan-300/40 focus:border-cyan-500 transition-all resize-none"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer - Fixed */}
            <div className="flex items-center gap-3 p-6 border-t border-[#26262B] bg-[#121214] flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-11 rounded-xl border border-[#2F2F36] text-[#EDEDEF] hover:bg-[#1E1E22] focus:outline-none focus:ring-2 focus:ring-cyan-300/40 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 h-11 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 active:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add {formData.type === "expense" ? "Expense" : "Income"}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddExpenseModal;
