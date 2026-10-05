const express = require("express");
const router = express.Router();
const Settings = require("../models/Settings");

// ─── Helper: validate admin passcode ─────────────────────────────────────────
function requireAdmin(req, res, next) {
  const passcode = req.headers["x-admin-passcode"];
  if (!passcode || passcode !== process.env.ADMIN_PASSCODE) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/settings  — public route to fetch general settings
// ─────────────────────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const settingsDocs = await Settings.find({});
    const settings = {};
    settingsDocs.forEach((doc) => {
      settings[doc.key] = doc.value;
    });

    // Default to true if not set yet
    if (settings.ticketsEnabled === undefined) {
      settings.ticketsEnabled = true;
    }

    res.json({ success: true, settings });
  } catch (err) {
    console.error("[GET /api/settings]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/settings  — admin route to update a setting
// ─────────────────────────────────────────────────────────────────────────────
router.patch("/", requireAdmin, async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ error: "key and value are required" });
    }

    await Settings.findOneAndUpdate(
      { key },
      { value },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: "Setting updated successfully" });
  } catch (err) {
    console.error("[PATCH /api/settings]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/settings/verify-passcode  — verify admin passcode securely
// ─────────────────────────────────────────────────────────────────────────────
router.post("/verify-passcode", (req, res) => {
  const { passcode } = req.body;
  const adminPasscode = process.env.ADMIN_PASSCODE;

  if (!adminPasscode) {
    console.error("[POST /api/settings/verify-passcode] ADMIN_PASSCODE is not configured");
    return res.status(500).json({ success: false, error: "Server authentication misconfigured" });
  }

  if (!passcode || passcode !== adminPasscode) {
    return res.status(401).json({ success: false, error: "Incorrect passcode" });
  }

  res.json({ success: true, message: "Authorized" });
});

module.exports = router;
