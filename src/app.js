import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"; // Ensure `.js` extension for ES modules
import faqRoutes from "./routes/faqRoutes.js"; // Ensure `.js` extension for ES modules

// Load environment variables
dotenv.config();

// Connect to MongoDB
try {
  await connectDB();
} catch (error) {
  console.error("❌ MongoDB Connection Failed:", error.message);
  process.exit(1);
}

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json()); // ⬅️ Ensures `req.body` works

// ✅ Routes
app.use("/api", faqRoutes);

// ✅ Global Error Handling Middleware (for unexpected errors)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});


export default app; // ✅ Use `export default` for ES modules
