import { useState, useEffect } from "react";
import { useExpenseStore } from "../store/expenseStore";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  PieChart,
  BarChart3,
  Target,
  DollarSign,
  ArrowLeft,
  RefreshCw,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import MinimalFooter from "../components/footer/MinimalFooter";

const Analytics = () => {
  const { expenses, loading, fetchExpenses } = useExpenseStore();
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const [selectedChart, setSelectedChart] = useState("spending");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Calculate comprehensive analytics data
  const getAnalyticsData = () => {
    const now = new Date();
    let startDate, endDate;

    switch (selectedPeriod) {
      case "lastMonth":
        startDate = startOfMonth(subMonths(now, 1));
        endDate = endOfMonth(subMonths(now, 1));
        break;
      case "last3Months":
        startDate = subMonths(now, 3);
        endDate = now;
        break;
      case "last6Months":
        startDate = subMonths(now, 6);
        endDate = now;
        break;
      case "thisYear":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = now;
        break;
      case "custom":
        startDate = dateRange.start
          ? new Date(dateRange.start)
          : subMonths(now, 1);
        endDate = dateRange.end ? new Date(dateRange.end) : now;
        break;
      default: /* thisMonth */
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
    }

    const filteredExpenses = expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= startDate && expDate <= endDate;
    });

    // Monthly trend data
    const bucket = {};
    filteredExpenses.forEach((e) => {
      const m = format(new Date(e.date), "MMM yyyy");
      if (!bucket[m]) bucket[m] = { income: 0, expense: 0 };
      bucket[m][e.type] += Number(e.amount) || 0;
    });
    const monthlyTrend = Object.entries(bucket).map(([m, v]) => ({
      month: m,
      income: v.income,
      expense: v.expense,
      net: v.income - v.expense,
    }));

    // Category breakdown
    const cat = {};
    filteredExpenses
      .filter((e) => e.type === "expense")
      .forEach(
        (e) => (cat[e.category] = (cat[e.category] || 0) + Number(e.amount))
      );
    const categoryBreakdown = Object.entries(cat)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    /* Weekly pattern */
    const weekBucket = {};
    filteredExpenses
      .filter((e) => e.type === "expense")
      .forEach((e) => {
        const day = format(new Date(e.date), "EEEE");
        weekBucket[day] = (weekBucket[day] || 0) + Number(e.amount);
      });
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const weeklyPattern = days.map((d) => ({
      day: d,
      amount: weekBucket[d] || 0,
    }));

    // Summary statistics
    const totalIncome = filteredExpenses
      .filter((e) => e.type === "income")
      .reduce((s, e) => s + Number(e.amount), 0);
    const totalExpense = filteredExpenses
      .filter((e) => e.type === "expense")
      .reduce((s, e) => s + Number(e.amount), 0);
    const netFlow = totalIncome - totalExpense;
    const diffDays = Math.max(1, Math.ceil((endDate - startDate) / 86_400_000));
    const avgDailySpend = totalExpense / diffDays;

    return {
      monthlyTrend,
      categoryBreakdown,
      weeklyPattern,
      summary: {
        totalIncome,
        totalExpense,
        netFlow,
        avgDailySpend,
        transactionCount: filteredExpenses.length,
        savingsRate:
          totalIncome > 0
            ? ((totalIncome - totalExpense) / totalIncome) * 100
            : 0,
      },
    };
  };

  const analytics = getAnalyticsData();
  const COLORS = [
    "#22D3EE",
    "#8B5CF6",
    "#34D399",
    "#F59E0B",
    "#F43F5E",
    "#06B6D4",
    "#7C3AED",
    "#10B981",
  ];

  const periodOptions = [
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "last3Months", label: "Last 3 Months" },
    { value: "last6Months", label: "Last 6 Months" },
    { value: "thisYear", label: "This Year" },
    { value: "custom", label: "Custom Range" },
  ];

  const chartOptions = [
    { value: "spending", label: "Spending Trend", icon: TrendingUp },
    { value: "category", label: "Category Breakdown", icon: PieChart },
    { value: "weekly", label: "Weekly Pattern", icon: BarChart3 },
  ];

  /* ----------  CHART HELPERS  ---------- */
  const hasMonthly = analytics.monthlyTrend.length > 0;
  const hasCategory = analytics.categoryBreakdown.length > 0;
  const hasWeekly = analytics.weeklyPattern.length > 0;

  const CustomTooltip = ({ active, payload, label }) =>
    active && payload?.length ? (
      <div className="bg-[#121214] border border-[#26262B] rounded-xl p-4 shadow-lg">
        <p className="text-[#EDEDEF] font-medium mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 mb-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-[#B3B3B8] text-sm capitalize">
              {p.dataKey}:
            </span>
            <span
              className={`font-semibold text-sm ${
                p.dataKey === "income"
                  ? "text-emerald-400"
                  : p.dataKey === "expense"
                  ? "text-rose-400"
                  : "text-cyan-400"
              }`}
            >
              ₹{Number(p.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    ) : null;

  /* ----------  RENDER  ---------- */
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0B0C]">
        <span className="text-[#8A8A92]">Loading analytics…</span>
      </div>
    );

  // ---------- CHART RENDERER ----------
  const buildChart = () => {
    switch (selectedChart) {
      case "spending":
        return hasMonthly ? (
          <LineChart data={analytics.monthlyTrend}>
            <defs>
              <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34D399" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2B2B31"
              strokeOpacity={0.3}
            />
            <XAxis dataKey="month" tick={{ fill: "#8A8A92", fontSize: 12 }} />
            <YAxis
              tick={{ fill: "#8A8A92", fontSize: 12 }}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#34D399"
              fill="url(#inc)"
              strokeWidth={2}
              name="Income"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#F43F5E"
              fill="url(#exp)"
              strokeWidth={2}
              name="Expense"
            />
            <Line
              type="monotone"
              dataKey="net"
              stroke="#22D3EE"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Net Flow"
            />
          </LineChart>
        ) : null;

      case "category":
        return hasCategory ? (
          <RechartsPieChart>
            <Pie
              data={analytics.categoryBreakdown.slice(0, 8)}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="amount"
              label={({ category, percent }) =>
                category ? `${category} ${(percent * 100).toFixed(0)}%` : ""
              }
            >
              {analytics.categoryBreakdown.slice(0, 8).map((e, i) => (
                <Cell key={e.category} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </RechartsPieChart>
        ) : null;

      case "weekly":
        return hasWeekly ? (
          <BarChart data={analytics.weeklyPattern}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2B2B31"
              strokeOpacity={0.3}
            />
            <XAxis dataKey="day" tick={{ fill: "#8A8A92", fontSize: 12 }} />
            <YAxis
              tick={{ fill: "#8A8A92", fontSize: 12 }}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" fill="#22D3EE" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : null;

      default:
        return null;
    }
  };

  const chartElement = buildChart();

  return (
    <>
      <div className="min-h-screen bg-[#0B0B0C] pt-6">
        <div className="mx-auto max-w-7xl px-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="h-10 w-10 rounded-xl border border-[#2F2F36] text-[#EDEDEF] hover:bg-[#1E1E22] grid place-items-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-[#EDEDEF]">
                  Analytics Dashboard
                </h1>
                <p className="text-[#8A8A92]">
                  Deep insights into your financial patterns
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-wrap gap-3">
                {/* Period Filter */}
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="h-10 px-4 rounded-xl bg-[#121214] border border-[#2B2B31] text-[#EDEDEF] focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
                >
                  {periodOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* Custom Date Range */}
                {selectedPeriod === "custom" && (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          start: e.target.value,
                        }))
                      }
                      className="h-10 px-3 rounded-xl bg-[#121214] border border-[#2B2B31] text-[#EDEDEF] focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          end: e.target.value,
                        }))
                      }
                      className="h-10 px-3 rounded-xl bg-[#121214] border border-[#2B2B31] text-[#EDEDEF] focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
                    />
                  </div>
                )}

                {/* Chart Type Filter */}
                <div className="flex gap-1 bg-[#121214] border border-[#26262B] rounded-xl p-1">
                  {chartOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSelectedChart(option.value)}
                        className={`h-8 px-3 rounded-lg text-sm transition-all flex items-center gap-2 ${
                          selectedChart === option.value
                            ? "bg-cyan-500 text-black"
                            : "text-[#8A8A92] hover:text-[#EDEDEF] hover:bg-[#1E1E22]"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="hidden sm:inline">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => fetchExpenses()}
                  className="h-10 px-4 rounded-xl border border-[#2F2F36] text-[#EDEDEF] hover:bg-[#1E1E22] transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* --- Summary Cards --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Total Income",
                val: analytics.summary.totalIncome,
                color: "emerald-400",
                Icon: TrendingUp,
              },
              {
                title: "Total Expenses",
                val: analytics.summary.totalExpense,
                color: "rose-400",
                Icon: TrendingUp,
                rotate: true,
              },
              {
                title: "Net Flow",
                val: analytics.summary.netFlow,
                color:
                  analytics.summary.netFlow >= 0 ? "emerald-400" : "rose-400",
                Icon: DollarSign,
              },
              {
                title: "Savings Rate",
                val: `${analytics.summary.savingsRate.toFixed(1)}%`,
                color:
                  analytics.summary.savingsRate >= 20
                    ? "emerald-400"
                    : analytics.summary.savingsRate >= 10
                    ? "yellow-400"
                    : "rose-400",
                Icon: Target,
              },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-[#121214] border border-[#26262B] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`h-10 w-10 rounded-xl bg-${c.color}/10 grid place-items-center`}
                  >
                    <c.Icon
                      className={`w-5 h-5 text-${c.color} ${
                        c.rotate ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
                <div className="text-sm text-[#8A8A92] mb-1">{c.title}</div>
                <div className={`text-2xl font-bold text-${c.color}`}>
                  {typeof c.val === "number"
                    ? `₹${c.val.toLocaleString()}`
                    : c.val}
                </div>
              </motion.div>
            ))}
          </div>

          {/* --- Main Chart --- */}
          <div className="rounded-2xl bg-[#121214] border border-[#26262B] p-6 mb-8">
            <h3 className="text-lg font-semibold text-[#EDEDEF] mb-6">
              {selectedChart === "spending"
                ? "Spending Trend"
                : selectedChart === "category"
                ? "Category Breakdown"
                : "Weekly Pattern"}
            </h3>

            <div className="h-96">
              {chartElement ? (
                <ResponsiveContainer width="100%" height="100%">
                  {chartElement}
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-[#8A8A92]">
                  No data for the selected period
                </div>
              )}
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Top Categories */}
            <div className="rounded-2xl bg-[#121214] border border-[#26262B] p-6">
              <h3 className="text-lg font-semibold text-[#EDEDEF] mb-6">
                Top Spending Categories
              </h3>
              <div className="space-y-4">
                {analytics.categoryBreakdown
                  .slice(0, 6)
                  .map((category, index) => (
                    <div
                      key={category.category}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                        <span className="text-[#EDEDEF] text-sm">
                          {category.category}
                        </span>
                      </div>
                      <span className="text-[#EDEDEF] font-semibold">
                        ₹{category.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl bg-[#121214] border border-[#26262B] p-6">
              <h3 className="text-lg font-semibold text-[#EDEDEF] mb-6">
                Quick Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[#8A8A92]">Total Transactions</span>
                  <span className="text-[#EDEDEF] font-semibold">
                    {analytics.summary.transactionCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8A92]">Avg Daily Spend</span>
                  <span className="text-[#EDEDEF] font-semibold">
                    ₹{analytics.summary.avgDailySpend.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8A92]">Highest Category</span>
                  <span className="text-[#EDEDEF] font-semibold">
                    {analytics.categoryBreakdown[0]?.category || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A8A92]">Financial Health</span>
                  <span
                    className={`font-semibold ${
                      analytics.summary.savingsRate >= 20
                        ? "text-emerald-400"
                        : analytics.summary.savingsRate >= 10
                        ? "text-yellow-400"
                        : "text-rose-400"
                    }`}
                  >
                    {analytics.summary.savingsRate >= 20
                      ? "Excellent"
                      : analytics.summary.savingsRate >= 10
                      ? "Good"
                      : "Needs Improvement"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MinimalFooter />
      </div>
    </>
  );
};

export default Analytics;
