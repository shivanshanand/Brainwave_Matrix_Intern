// pages/AIInsights.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useExpenseStore } from "../store/expenseStore";
import { useNavigate } from "react-router-dom";
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  Calendar,
  ArrowLeft,
  RefreshCw,
  Brain,
  Zap,
  Eye,
  DollarSign,
  PieChart,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  differenceInDays,
  parseISO,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import MinimalFooter from "../components/footer/MinimalFooter";

const AIInsights = () => {
  const { expenses, insights, loading, fetchExpenses } = useExpenseStore();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Generate comprehensive AI insights based on actual transaction data
  const generateSmartInsights = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const now = new Date();
    const thisMonth = startOfMonth(now);
    const lastMonth = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // Filter transactions by periods
    const thisMonthData = expenses.filter(
      (exp) => parseISO(exp.date) >= thisMonth
    );

    const lastMonthData = expenses.filter(
      (exp) =>
        parseISO(exp.date) >= lastMonth && parseISO(exp.date) <= lastMonthEnd
    );

    const allInsights = [];

    // 1. SPENDING TREND INSIGHTS
    const thisMonthExpenses = thisMonthData
      .filter((exp) => exp.type === "expense")
      .reduce((sum, exp) => sum + exp.amount, 0);
    const lastMonthExpenses = lastMonthData
      .filter((exp) => exp.type === "expense")
      .reduce((sum, exp) => sum + exp.amount, 0);

    if (lastMonthExpenses > 0) {
      const changePercent =
        ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;

      if (Math.abs(changePercent) > 10) {
        allInsights.push({
          id: "spending-trend",
          type: changePercent > 0 ? "warning" : "positive",
          icon: changePercent > 0 ? AlertTriangle : CheckCircle,
          color: changePercent > 0 ? "text-rose-400" : "text-emerald-400",
          priority: Math.abs(changePercent) > 25 ? "high" : "medium",
          title:
            changePercent > 0
              ? "Spending Increase Alert"
              : "Great Spending Control!",
          description: `Your spending ${
            changePercent > 0 ? "increased" : "decreased"
          } by ${Math.abs(changePercent).toFixed(
            1
          )}% this month (₹${thisMonthExpenses.toLocaleString()} vs ₹${lastMonthExpenses.toLocaleString()}).`,
          action:
            changePercent > 0
              ? "Review your recent expenses and identify areas to cut back"
              : "Keep up the good financial discipline!",
        });
      }
    }

    // 2. INCOME VS EXPENSES ANALYSIS
    const thisMonthIncome = thisMonthData
      .filter((exp) => exp.type === "income")
      .reduce((sum, exp) => sum + exp.amount, 0);

    const savingsRate =
      thisMonthIncome > 0
        ? ((thisMonthIncome - thisMonthExpenses) / thisMonthIncome) * 100
        : 0;

    if (thisMonthIncome > 0) {
      allInsights.push({
        id: "savings-rate",
        type:
          savingsRate >= 20
            ? "positive"
            : savingsRate >= 10
            ? "warning"
            : "alert",
        icon:
          savingsRate >= 20
            ? CheckCircle
            : savingsRate >= 10
            ? Target
            : AlertTriangle,
        color:
          savingsRate >= 20
            ? "text-emerald-400"
            : savingsRate >= 10
            ? "text-yellow-400"
            : "text-rose-400",
        priority: savingsRate < 10 ? "high" : "medium",
        title:
          savingsRate >= 20
            ? "Excellent Savings Rate!"
            : savingsRate >= 10
            ? "Good Savings Habit"
            : "Improve Your Savings",
        description: `Your current savings rate is ${savingsRate.toFixed(
          1
        )}%. ${
          savingsRate >= 20
            ? "You're exceeding the recommended 20% savings rate."
            : savingsRate >= 10
            ? "You're saving well, but try to reach the 20% target."
            : "Financial experts recommend saving at least 20% of your income."
        }`,
        action:
          savingsRate < 20
            ? "Create a budget to increase your savings rate"
            : "Consider investing your excess savings",
      });
    }

    // 3. CATEGORY SPENDING ANALYSIS
    const categoryTotals = {};
    thisMonthData
      .filter((exp) => exp.type === "expense")
      .forEach((exp) => {
        categoryTotals[exp.category] =
          (categoryTotals[exp.category] || 0) + exp.amount;
      });

    const sortedCategories = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    );

    if (sortedCategories.length > 0) {
      const topCategory = sortedCategories[0];
      const topCategoryPercent =
        thisMonthExpenses > 0 ? (topCategory[1] / thisMonthExpenses) * 100 : 0;

      allInsights.push({
        id: "top-category",
        type: topCategoryPercent > 40 ? "warning" : "spending",
        icon: topCategoryPercent > 40 ? AlertTriangle : PieChart,
        color: topCategoryPercent > 40 ? "text-rose-400" : "text-orange-400",
        priority: topCategoryPercent > 40 ? "high" : "medium",
        title:
          topCategoryPercent > 40
            ? "High Category Spending"
            : "Top Spending Category",
        description: `${
          topCategory[0]
        } is your biggest expense this month at ₹${topCategory[1].toLocaleString()} (${topCategoryPercent.toFixed(
          1
        )}% of total spending).`,
        action:
          topCategoryPercent > 40
            ? "Consider setting a budget limit for this category"
            : "Track this category closely to avoid overspending",
      });

      // Compare with last month's category spending
      const lastMonthCategories = {};
      lastMonthData
        .filter((exp) => exp.type === "expense")
        .forEach((exp) => {
          lastMonthCategories[exp.category] =
            (lastMonthCategories[exp.category] || 0) + exp.amount;
        });

      if (lastMonthCategories[topCategory[0]]) {
        const categoryChange =
          ((topCategory[1] - lastMonthCategories[topCategory[0]]) /
            lastMonthCategories[topCategory[0]]) *
          100;

        if (Math.abs(categoryChange) > 20) {
          allInsights.push({
            id: "category-change",
            type: categoryChange > 0 ? "warning" : "positive",
            icon: categoryChange > 0 ? TrendingUp : TrendingDown,
            color: categoryChange > 0 ? "text-rose-400" : "text-emerald-400",
            priority: Math.abs(categoryChange) > 50 ? "high" : "medium",
            title: `${topCategory[0]} Spending ${
              categoryChange > 0 ? "Surge" : "Reduction"
            }`,
            description: `Your ${topCategory[0]} spending ${
              categoryChange > 0 ? "increased" : "decreased"
            } by ${Math.abs(categoryChange).toFixed(
              1
            )}% compared to last month.`,
            action:
              categoryChange > 0
                ? `Investigate what caused the increase in ${topCategory[0]} expenses`
                : "Great job reducing expenses in this category!",
          });
        }
      }
    }

    // 4. SPENDING PATTERN ANALYSIS
    const weeklySpending = {};
    thisMonthData
      .filter((exp) => exp.type === "expense")
      .forEach((exp) => {
        const dayOfWeek = format(parseISO(exp.date), "EEEE");
        weeklySpending[dayOfWeek] =
          (weeklySpending[dayOfWeek] || 0) + exp.amount;
      });

    const maxSpendingDay = Object.entries(weeklySpending).sort(
      (a, b) => b[1] - a[1]
    )[0];

    if (maxSpendingDay && weeklySpending[maxSpendingDay[0]] > 0) {
      const avgDailySpending =
        Object.values(weeklySpending).reduce((a, b) => a + b, 0) / 7;

      if (maxSpendingDay[1] > avgDailySpending * 1.5) {
        allInsights.push({
          id: "spending-pattern",
          type: "pattern",
          icon: Calendar,
          color: "text-purple-400",
          priority: "low",
          title: "Weekly Spending Pattern",
          description: `You tend to spend most on ${
            maxSpendingDay[0]
          }s (₹${maxSpendingDay[1].toLocaleString()}). This is ${(
            (maxSpendingDay[1] / avgDailySpending - 1) *
            100
          ).toFixed(0)}% above your daily average.`,
          action: `Plan your ${maxSpendingDay[0]} expenses in advance to avoid overspending`,
        });
      }
    }

    // 5. TRANSACTION FREQUENCY INSIGHTS
    const avgTransactionsPerDay =
      thisMonthData.length / differenceInDays(now, thisMonth);

    if (avgTransactionsPerDay < 1) {
      allInsights.push({
        id: "tracking-frequency",
        type: "tracking",
        icon: Eye,
        color: "text-cyan-400",
        priority: "medium",
        title: "Increase Transaction Tracking",
        description: `You're recording an average of ${avgTransactionsPerDay.toFixed(
          1
        )} transactions per day. More detailed tracking leads to better insights.`,
        action:
          "Try to record smaller daily expenses like coffee, snacks, or transportation",
      });
    }

    // 6. LARGE TRANSACTION INSIGHTS
    const largeTransactions = thisMonthData.filter(
      (exp) =>
        exp.type === "expense" &&
        exp.amount >
          (thisMonthExpenses /
            thisMonthData.filter((e) => e.type === "expense").length) *
            3
    );

    if (largeTransactions.length > 0) {
      const largestTransaction = largeTransactions.sort(
        (a, b) => b.amount - a.amount
      )[0];
      allInsights.push({
        id: "large-transactions",
        type: "spending",
        icon: DollarSign,
        color: "text-orange-400",
        priority: "medium",
        title: "Notable Large Expense",
        description: `Your largest expense this month was ₹${largestTransaction.amount.toLocaleString()} in ${
          largestTransaction.category
        }${largestTransaction.note ? ` (${largestTransaction.note})` : ""}.`,
        action:
          "Consider if large expenses like this can be planned or reduced in the future",
      });
    }

    // 7. ACHIEVEMENT INSIGHTS
    if (thisMonthData.length > 20) {
      allInsights.push({
        id: "tracking-achievement",
        type: "positive",
        icon: CheckCircle,
        color: "text-emerald-400",
        priority: "low",
        title: "Excellent Expense Tracking!",
        description: `You've recorded ${thisMonthData.length} transactions this month. Consistent tracking is key to financial awareness.`,
        action: "Keep up the great habit of tracking all your expenses",
      });
    }

    // 8. INCOME STABILITY INSIGHTS
    const incomeTransactions = thisMonthData.filter(
      (exp) => exp.type === "income"
    );
    if (incomeTransactions.length > 0) {
      const avgIncomePerTransaction =
        thisMonthIncome / incomeTransactions.length;
      const hasRegularIncome = incomeTransactions.some((inc) =>
        ["Salary", "salary"].includes(inc.category)
      );

      if (!hasRegularIncome && incomeTransactions.length > 3) {
        allInsights.push({
          id: "income-diversity",
          type: "positive",
          icon: TrendingUp,
          color: "text-emerald-400",
          priority: "low",
          title: "Diversified Income Sources",
          description: `You have ${incomeTransactions.length} different income sources this month. Income diversification is great for financial stability.`,
          action:
            "Continue building multiple income streams for better financial security",
        });
      }
    }

    return allInsights;
  }, [expenses]);

  // Combine backend insights with generated smart insights
  const backendInsights = insights?.insights || [];
  const processedBackendInsights = backendInsights.map((insight, index) => {
    let type = "general";
    let icon = Lightbulb;
    let color = "text-cyan-400";
    let priority = "medium";
    let action = null;

    // Analyze backend insight content
    if (
      insight.includes("Alert") ||
      (insight.includes("up") && insight.includes("%"))
    ) {
      type = "warning";
      icon = AlertTriangle;
      color = "text-rose-400";
      priority = "high";
      action = "Review your spending patterns";
    } else if (insight.includes("less") || insight.includes("down")) {
      type = "positive";
      icon = CheckCircle;
      color = "text-emerald-400";
      priority = "medium";
      action = "Keep up the good work!";
    } else if (insight.includes("Most spent") || insight.includes("Biggest")) {
      type = "spending";
      icon = TrendingUp;
      color = "text-orange-400";
      priority = "medium";
      action = "Consider setting a budget for this category";
    } else if (insight.includes("Recurring") || insight.includes("pattern")) {
      type = "pattern";
      icon = Calendar;
      color = "text-purple-400";
      priority = "low";
      action = "Set up automatic tracking for recurring expenses";
    }

    return {
      id: `backend-${index}`,
      text: insight,
      type,
      icon,
      color,
      priority,
      action,
      timestamp: new Date().toISOString(),
    };
  });

  const allInsights = [...generateSmartInsights, ...processedBackendInsights];

  // Filter insights by category
  const filteredInsights =
    selectedCategory === "all"
      ? allInsights
      : allInsights.filter((insight) => insight.type === selectedCategory);

  // Update insight categories based on actual data
  const insightCategories = [
    { value: "all", label: "All Insights", icon: Brain },
    { value: "warning", label: "Alerts", icon: AlertTriangle },
    { value: "positive", label: "Achievements", icon: CheckCircle },
    { value: "spending", label: "Spending", icon: TrendingUp },
    { value: "pattern", label: "Patterns", icon: Calendar },
    { value: "tracking", label: "Tracking Tips", icon: Eye },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-rose-500/50 bg-rose-500/5";
      case "medium":
        return "border-yellow-500/50 bg-yellow-500/5";
      case "low":
        return "border-cyan-500/50 bg-cyan-500/5";
      default:
        return "border-[#26262B] bg-[#0B0B0C]";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#0B0B0C] pt-6">
        <div className="mx-auto max-w-6xl px-6">
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
                <h1 className="text-3xl font-bold text-[#EDEDEF] flex items-center gap-3">
                  <Brain className="w-8 h-8 text-cyan-400" />
                  AI Financial Insights
                </h1>
                <p className="text-[#8A8A92]">
                  Smart analysis of your spending patterns and financial
                  behavior
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {insightCategories.map((category) => {
                  const IconComponent = category.icon;
                  const categoryCount = allInsights.filter(
                    (insight) =>
                      category.value === "all" ||
                      insight.type === category.value
                  ).length;

                  return (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`h-10 px-4 rounded-xl transition-all flex items-center gap-2 ${
                        selectedCategory === category.value
                          ? "bg-cyan-500 text-black"
                          : "border border-[#2F2F36] text-[#EDEDEF] hover:bg-[#1E1E22]"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {category.label}
                      </span>
                      {categoryCount > 0 && (
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            selectedCategory === category.value
                              ? "bg-black/20 text-black"
                              : "bg-[#1E1E22] text-[#8A8A92]"
                          }`}
                        >
                          {categoryCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => fetchExpenses()}
                disabled={loading}
                className="h-10 px-4 rounded-xl border border-[#2F2F36] text-[#EDEDEF] hover:bg-[#1E1E22] disabled:opacity-50 transition-all flex items-center gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh Insights
              </button>
            </div>
          </div>

          {/* Insights Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Total Insights",
                value: allInsights.length,
                icon: Brain,
                color: "text-cyan-400",
                bg: "bg-cyan-400/10",
              },
              {
                title: "High Priority",
                value: allInsights.filter((i) => i.priority === "high").length,
                icon: AlertTriangle,
                color: "text-rose-400",
                bg: "bg-rose-400/10",
              },
              {
                title: "Achievements",
                value: allInsights.filter((i) => i.type === "positive").length,
                icon: CheckCircle,
                color: "text-emerald-400",
                bg: "bg-emerald-400/10",
              },
              {
                title: "Patterns Found",
                value: allInsights.filter((i) => i.type === "pattern").length,
                icon: BarChart3,
                color: "text-purple-400",
                bg: "bg-purple-400/10",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl bg-[#121214] border border-[#26262B] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`h-10 w-10 rounded-xl ${stat.bg} grid place-items-center`}
                  >
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-sm text-[#8A8A92] mb-1">{stat.title}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Insights List */}
          {filteredInsights.length > 0 ? (
            <div className="space-y-4">
              {filteredInsights.map((insight, index) => {
                const IconComponent = insight.icon;
                return (
                  <motion.div
                    key={insight.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-2xl border p-6 ${getPriorityColor(
                      insight.priority
                    )}`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`h-12 w-12 rounded-xl bg-[#1E1E22] grid place-items-center flex-shrink-0`}
                      >
                        <IconComponent className={`w-6 h-6 ${insight.color}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            {insight.title && (
                              <h3 className="text-lg font-semibold text-[#EDEDEF] mb-1">
                                {insight.title}
                              </h3>
                            )}
                            <p className="text-[#B3B3B8] leading-relaxed">
                              {insight.description || insight.text}
                            </p>
                          </div>

                          {insight.priority && (
                            <span
                              className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                insight.priority === "high"
                                  ? "bg-rose-400/10 text-rose-400"
                                  : insight.priority === "medium"
                                  ? "bg-yellow-400/10 text-yellow-400"
                                  : "bg-cyan-400/10 text-cyan-400"
                              }`}
                            >
                              {insight.priority.toUpperCase()}
                            </span>
                          )}
                        </div>

                        {insight.action && (
                          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#26262B]">
                            <Zap className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm text-cyan-400 font-medium">
                              Recommended Action: {insight.action}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-[#121214] border border-[#26262B] grid place-items-center">
                <Brain className="w-8 h-8 text-[#8A8A92]" />
              </div>
              <h3 className="text-xl font-semibold text-[#EDEDEF] mb-2">
                No insights available
              </h3>
              <p className="text-[#8A8A92] mb-6 max-w-md mx-auto">
                {selectedCategory === "all"
                  ? "Add more transactions to generate AI insights about your spending patterns."
                  : `No ${selectedCategory} insights found. Try adding more transactions or select a different category.`}
              </p>
              {selectedCategory !== "all" && (
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="h-10 px-4 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-all"
                >
                  View All Insights
                </button>
              )}
            </div>
          )}

          {/* AI Insights Footer */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-6 h-6 text-cyan-400" />
              <h3 className="text-lg font-semibold text-[#EDEDEF]">
                Smart Insights Engine
              </h3>
            </div>
            <p className="text-[#B3B3B8] mb-4">
              Our AI analyzes your transaction history to identify spending
              trends, savings opportunities, and financial patterns. Insights
              are generated from your actual data including spending
              comparisons, category analysis, and behavioral patterns.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-[#B3B3B8]">Spending Trends</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <span className="text-[#B3B3B8]">Savings Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-purple-400" />
                <span className="text-[#B3B3B8]">Category Insights</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                <span className="text-[#B3B3B8]">Pattern Detection</span>
              </div>
            </div>
          </div>
        </div>
        <MinimalFooter />
      </div>
    </>
  );
};

export default AIInsights;
