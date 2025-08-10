import Expense from "../models/Expense.js";
import { generateInsights } from "../utils/insight.js";

// Add expense
export const addExpense = async (req, res) => {
  const { amount, category, note, date,type } = req.body;
  try {
    const expense = await Expense.create({
      user: req.user.id,
      amount,
      category,
      note,
      date,
      type
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ msg: "Error adding expense", error: err.message });
  }
};

// Get all expenses
export const getExpenses = async (req, res) => {
  const { from, to } = req.query;
  let filter = { user: req.user.id };
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  try {
    const expenses = await Expense.find(filter).sort({ date: -1 });
    // Generate insights based on these expenses (all or filtered)
    const insights = generateInsights(expenses);

    res.json({
      expenses,
      insights, // <-- Now your frontend receives both!
    });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Error fetching expenses", error: err.message });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!expense) return res.status(404).json({ msg: "Expense not found" });
    res.json({ msg: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting expense", error: err.message });
  }
};
