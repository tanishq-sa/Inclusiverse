require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const bookingsRouter = require("./routes/bookings");

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "http://localhost:5173",
        "https://inclusiverse.in",
        process.env.CORS_ORIGIN,
      ];

      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-admin-passcode"],
  })
);
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/bookings", bookingsRouter);
app.use("/api/settings", require("./routes/settings"));

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Chhichhore API is running 🎬" });
});

// ─── MongoDB Connection ────────────────────────────────────────────────────────
if (!process.env.MONGO_URI) {
  console.error("❌ FATAL: MONGO_URI environment variable is missing.");
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection failed:", err.message));
}

// Only start the local server if we are not on Vercel
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export the Express app for Vercel Serverless
module.exports = app;
