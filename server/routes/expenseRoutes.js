// routes/expenseRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import {
  addExpense,
  getExpenses,
  deleteExpense,
} from "../controllers/Expense.controller.js";

const router = express.Router();
router.post("/", auth, addExpense);
router.get("/", auth, getExpenses);
router.delete("/:id", auth, deleteExpense);

export default router;
