import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );
}

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/expenses", expenseRoutes);

if (process.env.NODE_ENV === "production") {
  const dist = path.join(__dirname, "../client/dist");
  app.use(express.static(dist));
  app.get("/*catchall", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

// Connect MongoDB, then start server
const PORT = process.env.PORT;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
