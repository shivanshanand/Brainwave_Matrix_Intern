import { ArrowRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";

// Update RecentTransactions.jsx
const RecentTransactions = ({ expenses, onViewAll }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
  };

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

  if (!expenses || expenses.length === 0) {
    return (
      <div className="rounded-2xl bg-[#121214] border border-[#26262B] p-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-[#1E1E22] grid place-items-center">
          <Calendar className="w-6 h-6 text-[#8A8A92]" />
        </div>
        <h3 className="text-lg font-semibold text-[#EDEDEF] mb-2">
          No transactions yet
        </h3>
        <p className="text-[#8A8A92]">
          Your recent transactions will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#121214] border border-[#26262B] overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-[#26262B]">
        <h3 className="text-lg font-semibold text-[#EDEDEF]">
          Recent Transactions
        </h3>
        <button
          onClick={onViewAll}
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="divide-y divide-[#26262B]">
        {expenses.map((expense, index) => (
          <motion.div
            key={expense._id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 hover:bg-[#17171A] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`h-10 w-10 rounded-xl grid place-items-center text-lg font-bold ${
                    expense.type === "expense"
                      ? "bg-rose-400/10 text-rose-400"
                      : "bg-emerald-400/10 text-emerald-400"
                  }`}
                >
                  {expense.type === "expense" ? "−" : "+"}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[#EDEDEF]">
                      {/* Fix: Use 'note' field instead of 'description' */}
                      {expense.note || expense.description || "Transaction"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs border ${getCategoryColor(
                        expense.category
                      )}`}
                    >
                      {expense.category}
                    </span>
                  </div>
                  <div className="text-sm text-[#8A8A92] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(expense.date)}
                  </div>
                </div>
              </div>

              <div
                className={`text-right font-semibold ${
                  expense.type === "expense"
                    ? "text-rose-400"
                    : "text-emerald-400"
                }`}
              >
                {expense.type === "expense" ? "−" : "+"}₹
                {expense.amount.toLocaleString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
