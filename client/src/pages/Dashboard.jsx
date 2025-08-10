import { useState, useEffect } from "react";
import { useExpenseStore } from "../store/expenseStore";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  ArrowRight,
  Calendar,
  Filter,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import StatsCards from "../components/dashboard/StatsCards";
import SpendingChart from "../components/dashboard/SpendingChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";
import InsightsPanel from "../components/dashboard/InsightsPanel";
import AddExpenseModal from "../components/modals/AddExpenseModal";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton ";
import { useAutoRefresh } from "../hooks/useAutoRefresh";
import MinimalFooter from "../components/footer/MinimalFooter";

// Move this function outside the component
const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning! ☀️";
  if (hour < 17) return "Good afternoon! 🌤️";
  if (hour < 21) return "Good evening! 🌅";
  return "Good night! 🌙";
};

const Dashboard = () => {
  const { expenses, insights, loading, fetchExpenses } = useExpenseStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [periodFilter, setPeriodFilter] = useState("thisMonth");
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Auto-refresh when expenses change or modal closes
  useAutoRefresh([expenses.length, isAddModalOpen], fetchExpenses, 500);

  // Add this effect to refresh when modal closes after successful addition
  useEffect(() => {
    if (!isAddModalOpen) {
      // Small delay to ensure backend has processed the new transaction
      const timer = setTimeout(() => {
        fetchExpenses();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isAddModalOpen, fetchExpenses]);

  // Move this function inside the component but after the hooks
  const getFilteredExpenses = () => {
    const now = new Date();
    let startDate;

    switch (periodFilter) {
      case "thisMonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "last3Months":
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case "thisYear":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return expenses.filter((exp) => new Date(exp.date) >= startDate);
  };

  // Calculate stats based on current period
  const getStats = () => {
    const filteredExpenses = getFilteredExpenses();

    const periodExpenses = filteredExpenses.filter(
      (exp) => exp.type === "expense"
    );
    const periodIncome = filteredExpenses.filter(
      (exp) => exp.type === "income"
    );

    const totalExpenses = periodExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );
    const totalIncome = periodIncome.reduce((sum, exp) => sum + exp.amount, 0);

    return {
      totalBalance: totalIncome - totalExpenses,
      monthlyIncome: totalIncome,
      monthlyExpenses: totalExpenses,
      savingsRate:
        totalIncome > 0
          ? ((totalIncome - totalExpenses) / totalIncome) * 100
          : 0,
    };
  };

  const filteredExpenses = getFilteredExpenses();
  const stats = getStats();

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Empty state handling
  if (!loading && expenses.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] pt-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center py-20">
            <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-[#121214] border border-[#26262B] grid place-items-center">
              <DollarSign className="w-8 h-8 text-[#8A8A92]" />
            </div>
            <h2 className="text-2xl font-bold text-[#EDEDEF] mb-2">
              No expenses yet
            </h2>
            <p className="text-[#8A8A92] mb-6 max-w-md mx-auto">
              Start tracking your finances by adding your first expense or
              income entry.
            </p>
            <button
              onClick={() => {
                console.log("Button clicked!"); // Debug log
                setIsAddModalOpen(true);
              }}
              className="h-12 px-6 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your First Expense
            </button>
          </div>
        </div>

        <AddExpenseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] pt-6">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#EDEDEF] mb-2">
                {getTimeBasedGreeting()}
              </h1>
              <p className="text-[#8A8A92]">
                Here's your financial overview for{" "}
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => navigate("/analytics")}
                className="h-10 px-4 rounded-xl border border-[#2F2F36] text-[#EDEDEF] hover:bg-[#1E1E22] transition-all flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="h-10 px-4 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Transaction
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Period Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {["thisMonth", "last3Months", "thisYear"].map((period) => (
              <button
                key={period}
                onClick={() => setPeriodFilter(period)}
                data-active={periodFilter === period}
                className="px-4 h-9 rounded-lg border border-[#2B2B31] text-[#B3B3B8] hover:border-cyan-600 hover:text-[#EDEDEF] data-[active=true]:bg-cyan-500 data-[active=true]:text-black transition-all whitespace-nowrap"
              >
                {period === "thisMonth"
                  ? "This Month"
                  : period === "last3Months"
                  ? "Last 3 Months"
                  : "This Year"}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-8">
            <SpendingChart expenses={filteredExpenses} period={periodFilter} />
            <CategoryBreakdown
              expenses={filteredExpenses}
              period={periodFilter}
            />
          </div>

          {/* Right Column - Insights */}
          <div className="space-y-8">
            <InsightsPanel insights={insights} />

            {/* Quick Stats Card */}
            <div className="rounded-2xl bg-[#121214] border border-[#26262B] p-6">
              <h3 className="text-lg font-semibold text-[#EDEDEF] mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/transactions")}
                  className="w-full h-10 px-4 rounded-xl border border-[#2F2F36] text-[#EDEDEF] hover:bg-[#1E1E22] transition-all flex items-center justify-between"
                >
                  <span>View All Transactions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate("/insights")}
                  className="w-full h-10 px-4 rounded-xl border border-[#2F2F36] text-[#EDEDEF] hover:bg-[#1E1E22] transition-all flex items-center justify-between"
                >
                  <span>AI Insights</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <RecentTransactions
          expenses={filteredExpenses.slice(0, 8)}
          onViewAll={() => navigate("/transactions")}
        />
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <MinimalFooter />
    </div>
  );
};

export default Dashboard;
