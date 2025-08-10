// components/dashboard/StatsCards.jsx
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, Target } from "lucide-react";

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Balance",
      value: `₹${stats.totalBalance.toLocaleString()}`,
      icon: DollarSign,
      trend: stats.totalBalance >= 0 ? "positive" : "negative",
      change: "Current balance",
    },
    {
      title: "Monthly Income",
      value: `₹${stats.monthlyIncome.toLocaleString()}`,
      icon: TrendingUp,
      trend: "positive",
      change: "This month",
    },
    {
      title: "Monthly Expenses",
      value: `₹${stats.monthlyExpenses.toLocaleString()}`,
      icon: TrendingDown,
      trend: "negative",
      change: "This month",
    },
    {
      title: "Savings Rate",
      value: `${stats.savingsRate.toFixed(1)}%`,
      icon: Target,
      trend: stats.savingsRate >= 20 ? "positive" : "neutral",
      change: "Target: 20%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="rounded-2xl bg-[#121214] border border-[#26262B] p-6 hover:border-[#2F2F36] transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-[#1E1E22] grid place-items-center">
              <card.icon className="w-5 h-5 text-cyan-400" />
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-lg ${
                card.trend === "positive"
                  ? "bg-emerald-400/10 text-emerald-400"
                  : card.trend === "negative"
                  ? "bg-rose-400/10 text-rose-400"
                  : "bg-[#1E1E22] text-[#8A8A92]"
              }`}
            >
              {card.change}
            </span>
          </div>
          <div className="text-sm text-[#8A8A92] mb-1">{card.title}</div>
          <div className="text-2xl font-bold text-[#EDEDEF]">{card.value}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
