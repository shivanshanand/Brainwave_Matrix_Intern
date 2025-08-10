// pages/Transactions.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useExpenseStore } from "../store/expenseStore";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  ArrowLeft,
  Calendar,
  DollarSign,
  Tag,
  Plus,
  Minus,
  ArrowUpDown,
  RefreshCw,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import MinimalFooter from "../components/footer/MinimalFooter";

const Transactions = () => {
  const { expenses, loading, fetchExpenses, deleteExpense } = useExpenseStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const itemsPerPage = 20;

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = [...new Set(expenses.map((exp) => exp.category))].filter(
      Boolean
    );
    return cats.sort();
  }, [expenses]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = expenses.filter((transaction) => {
      // Search filter
      const searchMatch =
        searchTerm === "" ||
        (transaction.note &&
          transaction.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transaction.description &&
          transaction.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const typeMatch = typeFilter === "all" || transaction.type === typeFilter;

      // Category filter
      const categoryMatch =
        categoryFilter === "all" || transaction.category === categoryFilter;

      // Date range filter
      const dateMatch =
        (!dateRange.start ||
          new Date(transaction.date) >= new Date(dateRange.start)) &&
        (!dateRange.end ||
          new Date(transaction.date) <= new Date(dateRange.end));

      return searchMatch && typeMatch && categoryMatch && dateMatch;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "category":
          aValue = a.category;
          bValue = b.category;
          break;
        case "date":
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [
    expenses,
    searchTerm,
    typeFilter,
    categoryFilter,
    dateRange,
    sortBy,
    sortOrder,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle transaction selection
  const handleSelectTransaction = (transactionId) => {
    setSelectedTransactions((prev) =>
      prev.includes(transactionId)
        ? prev.filter((id) => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTransactions.length === paginatedTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(paginatedTransactions.map((t) => t._id));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (
      window.confirm(
        `Delete ${selectedTransactions.length} selected transactions?`
      )
    ) {
      try {
        await Promise.all(selectedTransactions.map((id) => deleteExpense(id)));
        setSelectedTransactions([]);
        fetchExpenses();
      } catch (error) {
        console.error("Error deleting transactions:", error);
      }
    }
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      "Food & Dining": "bg-orange-400/10 text-orange-400 border-orange-400/20",
      Transportation: "bg-blue-400/10 text-blue-400 border-blue-400/20",
      Shopping: "bg-purple-400/10 text-purple-400 border-purple-400/20",
      Entertainment: "bg-pink-400/10 text-pink-400 border-pink-400/20",
      "Bills & Utilities":
        "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
      Healthcare: "bg-red-400/10 text-red-400 border-red-400/20",
      Salary: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
      Freelance: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
    };
    return colors[category] || "bg-[#1E1E22] text-[#8A8A92] border-[#2B2B31]";
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setDateRange({ start: "", end: "" });
    setSortBy("date");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] pt-6">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="h-10 w-10 rounded-xl border border-[#2F2F36] text-[#EDEDEF] hover:bg-[#1E1E22] grid place-items-center transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#EDEDEF]">
                All Transactions
              </h1>
              <p className="text-[#8A8A92]">
                {filteredTransactions.length} of {expenses.length} transactions
              </p>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6A6A72]" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#121214] border border-[#2B2B31] text-[#EDEDEF] placeholder:text-[#6A6A72] focus:outline-none focus:ring-2 focus:ring-cyan-300/40 focus:border-cyan-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`h-11 px-4 rounded-xl transition-all flex items-center gap-2 ${
                  showFilters
                    ? "bg-cyan-500 text-black"
                    : "border border-[#2F2F36] text-[#EDEDEF] hover:bg-[#1E1E22]"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              {selectedTransactions.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="h-11 px-4 rounded-xl border border-rose-500/50 text-rose-400 hover:bg-rose-500/10 transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedTransactions.length})
                </button>
              )}

              <button
                onClick={() => fetchExpenses()}
                className="h-11 px-4 rounded-xl border border-[#2F2F36] text-[#EDEDEF] hover:bg-[#1E1E22] transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 rounded-2xl bg-[#121214] border border-[#26262B] p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#B3B3B8] mb-2 block">
                      Type
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#121214] border border-[#2B2B31] text-[#EDEDEF] focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
                    >
                      <option value="all">All Types</option>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#B3B3B8] mb-2 block">
                      Category
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#121214] border border-[#2B2B31] text-[#EDEDEF] focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#B3B3B8] mb-2 block">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          start: e.target.value,
                        }))
                      }
                      className="w-full h-10 px-3 rounded-xl bg-[#121214] border border-[#2B2B31] text-[#EDEDEF] focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[#B3B3B8] mb-2 block">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          end: e.target.value,
                        }))
                      }
                      className="w-full h-10 px-3 rounded-xl bg-[#121214] border border-[#2B2B31] text-[#EDEDEF] focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={clearFilters}
                    className="h-9 px-4 rounded-xl text-[#8A8A92] hover:text-[#EDEDEF] hover:bg-[#1E1E22] transition-all text-sm"
                  >
                    Clear All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Transactions Table */}
        <div className="rounded-2xl bg-[#121214] border border-[#26262B] overflow-hidden">
          {/* Table Header */}
          <div className="bg-[#0B0B0C] border-b border-[#26262B] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={
                    selectedTransactions.length ===
                      paginatedTransactions.length &&
                    paginatedTransactions.length > 0
                  }
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-[#2B2B31] bg-[#121214] text-cyan-500 focus:ring-cyan-500/40"
                />
                <span className="text-sm text-[#8A8A92]">
                  {selectedTransactions.length > 0 &&
                    `${selectedTransactions.length} selected`}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Options */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#8A8A92]">Sort by:</span>
                  {[
                    { value: "date", label: "Date", icon: Calendar },
                    { value: "amount", label: "Amount", icon: DollarSign },
                    { value: "category", label: "Category", icon: Tag },
                  ].map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleSort(option.value)}
                        className={`h-8 px-3 rounded-lg text-sm transition-all flex items-center gap-1 ${
                          sortBy === option.value
                            ? "bg-cyan-500 text-black"
                            : "text-[#8A8A92] hover:text-[#EDEDEF] hover:bg-[#1E1E22]"
                        }`}
                      >
                        <IconComponent className="w-3 h-3" />
                        {option.label}
                        {sortBy === option.value && (
                          <ArrowUpDown
                            className={`w-3 h-3 ${
                              sortOrder === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="divide-y divide-[#26262B]">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="p-4 hover:bg-[#17171A] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.includes(transaction._id)}
                      onChange={() => handleSelectTransaction(transaction._id)}
                      className="h-4 w-4 rounded border-[#2B2B31] bg-[#121214] text-cyan-500 focus:ring-cyan-500/40"
                    />

                    <div
                      className={`h-10 w-10 rounded-xl grid place-items-center text-lg font-bold ${
                        transaction.type === "expense"
                          ? "bg-rose-400/10 text-rose-400"
                          : "bg-emerald-400/10 text-emerald-400"
                      }`}
                    >
                      {transaction.type === "expense" ? "−" : "+"}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-[#EDEDEF]">
                          {transaction.note ||
                            transaction.description ||
                            "Transaction"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-lg text-xs border ${getCategoryColor(
                            transaction.category
                          )}`}
                        >
                          {transaction.category}
                        </span>
                      </div>
                      <div className="text-sm text-[#8A8A92] flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(transaction.date)}
                        </span>
                        {transaction.notes && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            Has notes
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className={`text-right font-semibold ${
                        transaction.type === "expense"
                          ? "text-rose-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {transaction.type === "expense" ? "−" : "+"}₹
                      {transaction.amount.toLocaleString()}
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="h-8 w-8 rounded-lg hover:bg-[#1E1E22] text-[#8A8A92] hover:text-cyan-400 grid place-items-center transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Delete this transaction?")) {
                            deleteExpense(transaction._id);
                          }
                        }}
                        className="h-8 w-8 rounded-lg hover:bg-rose-500/10 text-[#8A8A92] hover:text-rose-400 grid place-items-center transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-[#1E1E22] border border-[#26262B] grid place-items-center">
                  <Search className="w-8 h-8 text-[#8A8A92]" />
                </div>
                <h3 className="text-xl font-semibold text-[#EDEDEF] mb-2">
                  No transactions found
                </h3>
                <p className="text-[#8A8A92] mb-6">
                  Try adjusting your search criteria or clear the filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="h-10 px-4 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-[#0B0B0C] border-t border-[#26262B] p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-[#8A8A92]">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredTransactions.length
                  )}{" "}
                  of {filteredTransactions.length} transactions
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="h-9 px-3 rounded-lg border border-[#2F2F36] text-[#EDEDEF] hover:bg-[#1E1E22] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page =
                        currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (page > totalPages) return null;

                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`h-9 w-9 rounded-lg transition-all ${
                            currentPage === page
                              ? "bg-cyan-500 text-black"
                              : "border border-[#2F2F36] text-[#EDEDEF] hover:bg-[#1E1E22]"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="h-9 px-3 rounded-lg border border-[#2F2F36] text-[#EDEDEF] hover:bg-[#1E1E22] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <MinimalFooter />
    </div>
  );
};

export default Transactions;
