import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL, // frontend URL
    credentials: true, // allows cookies
  })
);

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/expenses", expenseRoutes);

// Healthcheck route
app.get("/", (req, res) => {
  res.send("Expense Tracker API is running!");
});

// Connect MongoDB, then start server
const PORT = process.env.PORT;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
