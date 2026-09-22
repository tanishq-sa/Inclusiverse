require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const bookingsRouter = require("./routes/bookings");

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Security & Rate Limiting ────────────────────────────────────────────────
// Trust the Vercel/Cloudflare proxy so we get the real client IP for rate limiting
app.set("trust proxy", 1);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: "Too many requests from this IP, please try again after 15 minutes" },
});

// Apply the rate limiting middleware to all requests
app.use(globalLimiter);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: "*", // Allow all origins to bypass CORS issues on Vercel
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-admin-passcode", "Authorization"],
  })
);
app.use(express.json());

// ─── Serverless MongoDB Connection Middleware ─────────────────────────────────
let isConnected = false;
app.use(async (req, res, next) => {
  if (isConnected) return next();
  if (!process.env.MONGO_URI) {
    console.error("❌ FATAL: MONGO_URI environment variable is missing.");
    return res.status(500).json({ error: "Server misconfiguration" });
  }
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // fail fast if unable to connect
    });
    isConnected = true;
    console.log("✅ Connected to MongoDB");
    next();
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/bookings", bookingsRouter);
app.use("/api/settings", require("./routes/settings"));

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Chhichhore API is running 🎬" });
});

// Only start the local server if we are not on Vercel
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export the Express app for Vercel Serverless
module.exports = app;
