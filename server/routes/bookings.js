const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const multer = require("multer");
const Booking = require("../models/Booking");
const { sendConfirmation } = require("../mail/sendConfirmation");
const { uploadToR2 } = require("../utils/r2Upload");
const { extractTextFromImage, analyzePaymentText } = require("../utils/ocr");

// Multer setup — store in memory for serverless
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// ─── Helper: generate a booking ID ───────────────────────────────────────────
function generateBookingId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `CHI-${suffix}`;
}

// ─── Helper: validate admin passcode ─────────────────────────────────────────
function requireAdmin(req, res, next) {
  const passcode = req.headers["x-admin-passcode"];
  if (!passcode || passcode !== process.env.ADMIN_PASSCODE) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// ─── Helper: generate tickets for a booking ──────────────────────────────────
function generateTickets(allAttendees) {
  return allAttendees.map((a) => ({
    ticketId: crypto.randomUUID(),
    attendeeName: a.name,
    attendeeRegNo: a.regNo,
    attendeeEmail: a.email,
    checkedIn: false,
  }));
}

// ─── Fixed pricing map ───────────────────────────────────────────────────────
const PRICE_MAP = { 1: 59, 2: 99, 3: 139, 4: 179, 5: 219 };

function getExpectedAmount(attendeeCount) {
  return PRICE_MAP[attendeeCount] || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/bookings/upload-payment — new GPay flow
// ─────────────────────────────────────────────────────────────────────────────
router.post("/upload-payment", upload.single("screenshot"), async (req, res) => {
  try {
    const { primaryName, primaryRegNo, primaryEmail, attendees, totalAmount } = req.body;

    // Parse attendees if it's a JSON string (from FormData)
    let extraAttendees = [];
    if (attendees) {
      try {
        extraAttendees = typeof attendees === "string" ? JSON.parse(attendees) : attendees;
      } catch {
        extraAttendees = [];
      }
    }

    // Validation
    if (!primaryName || !primaryRegNo || !primaryEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!/^(\d{6}|\d{8})$/.test(primaryRegNo)) {
      return res.status(400).json({ error: "Registration number must be 6 or 8 digits" });
    }

    if (!primaryEmail.toLowerCase().endsWith("christuniversity.in")) {
      return res.status(400).json({ error: "Email must be a Christ University email" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Payment screenshot is required" });
    }

    const attendeeCount = 1 + extraAttendees.length;
    const expectedAmount = getExpectedAmount(attendeeCount);
    const submittedAmount = parseInt(totalAmount, 10);

    if (!expectedAmount || submittedAmount !== expectedAmount) {
      return res.status(400).json({ error: `Invalid amount. Expected ₹${expectedAmount} for ${attendeeCount} attendee(s).` });
    }

    // 1) Upload screenshot to Cloudflare R2
    let screenshotUrl;
    try {
      screenshotUrl = await uploadToR2(req.file.buffer, req.file.originalname, req.file.mimetype);
    } catch (err) {
      console.error("[R2 Upload]", err.message);
      return res.status(500).json({ error: "Failed to upload screenshot. Please try again." });
    }

    // 2) Generate unique booking ID
    let bookingId;
    let attempts = 0;
    do {
      bookingId = generateBookingId();
      attempts++;
    } while ((await Booking.exists({ bookingId })) && attempts < 10);

    // 3) Run OCR to verify payment
    let ocrResult = { isValid: false, confidence: "none", reasons: ["OCR skipped"] };
    try {
      const extractedText = await extractTextFromImage(req.file.buffer, req.file.originalname);
      ocrResult = analyzePaymentText(extractedText, expectedAmount);
      console.log(`[OCR] Booking ${bookingId}: confidence=${ocrResult.confidence}, valid=${ocrResult.isValid}, reasons=${ocrResult.reasons.join("; ")}`);
    } catch (err) {
      console.error(`[OCR] Failed for booking ${bookingId}:`, err.message);
      ocrResult = { isValid: false, confidence: "none", reasons: ["OCR failed: " + err.message] };
    }

    // 4) Determine status based on OCR result
    const allAttendees = [
      { name: primaryName, regNo: primaryRegNo, email: primaryEmail },
      ...extraAttendees,
    ];

    let status;

    // Always generate tickets upfront to satisfy the unique ticketId index constraint
    const tickets = generateTickets(allAttendees);

    if (ocrResult.isValid && ocrResult.confidence === "high") {
      // Auto-approved
      status = "paid";
    } else {
      // Needs manual review
      status = "pending_review";
    }

    const booking = await Booking.create({
      bookingId,
      primaryName,
      primaryRegNo,
      primaryEmail,
      attendees: extraAttendees,
      tickets,
      attendeeCount,
      totalAmount: expectedAmount,
      paymentMethod: "gpay",
      paymentScreenshotUrl: screenshotUrl,
      status,
      reviewedBy: status === "paid" ? "auto-ocr" : undefined,
      reviewedAt: status === "paid" ? new Date() : undefined,
      ocrReasons: ocrResult.reasons,
      ocrConfidence: ocrResult.confidence,
      ocrIsValid: ocrResult.isValid,
    });

    // 5) If auto-approved, send confirmation email
    if (status === "paid") {
      try {
        const emailPromise = sendConfirmation(booking);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Email sending timed out after 7s")), 7000)
        );
        await Promise.race([emailPromise, timeoutPromise]);
        booking.emailSent = true;
        await booking.save();
      } catch (err) {
        console.error("[Mail] Failed to send confirmation:", err.message);
      }
    }

    res.status(201).json({
      success: true,
      bookingId: booking.bookingId,
      status,
      message: status === "paid"
        ? "Payment verified! Your tickets have been emailed."
        : "Screenshot received! Your booking is under review. You'll get an email once approved.",
    });
  } catch (err) {
    console.error("[POST /api/bookings/upload-payment]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/bookings/review-payment — admin approve/reject (admin only)
// ─────────────────────────────────────────────────────────────────────────────
router.post("/review-payment", requireAdmin, async (req, res) => {
  try {
    const { bookingId, action, reason } = req.body;

    if (!bookingId || !["approve", "reject"].includes(action)) {
      return res.status(400).json({ error: "bookingId and action (approve/reject) are required" });
    }

    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status !== "pending_review") {
      return res.status(409).json({ error: `Booking is already ${booking.status}` });
    }

    if (action === "approve") {
      // Tickets were already generated during upload, just update status
      booking.status = "paid";
      booking.reviewedBy = "manual";
      booking.reviewedAt = new Date();
      await booking.save();

      // Send confirmation email
      try {
        await sendConfirmation(booking);
        booking.emailSent = true;
        await booking.save();
      } catch (err) {
        console.error("[Mail] Failed to send after approval:", err.message);
      }

      res.json({
        success: true,
        message: `Booking ${bookingId} approved. Tickets generated & email sent.`,
      });
    } else {
      // Reject
      booking.status = "rejected";
      booking.rejectionReason = reason || "Payment could not be verified";
      booking.reviewedBy = "manual";
      booking.reviewedAt = new Date();
      await booking.save();

      res.json({
        success: true,
        message: `Booking ${bookingId} rejected.`,
      });
    }
  } catch (err) {
    console.error("[POST /api/bookings/review-payment]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/bookings/edit-email — admin edit attendee email (admin only)
// ─────────────────────────────────────────────────────────────────────────────
router.patch("/edit-email", requireAdmin, async (req, res) => {
  try {
    const { bookingId, ticketId, newEmail } = req.body;

    if (!bookingId || !newEmail) {
      return res.status(400).json({ error: "bookingId and newEmail are required" });
    }

    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // If ticketId is provided, update that specific ticket's email
    if (ticketId) {
      const ticket = booking.tickets.find((t) => t.ticketId === ticketId);
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      ticket.attendeeEmail = newEmail;

      // Also update the matching attendee in the attendees array
      if (ticket.attendeeName === booking.primaryName && ticket.attendeeRegNo === booking.primaryRegNo) {
        booking.primaryEmail = newEmail;
      } else {
        const att = booking.attendees.find((a) => a.regNo === ticket.attendeeRegNo);
        if (att) att.email = newEmail;
      }
    } else {
      // Update primary email
      booking.primaryEmail = newEmail;
      // Also update in tickets if matching
      const primaryTicket = booking.tickets.find((t) => t.attendeeRegNo === booking.primaryRegNo);
      if (primaryTicket) primaryTicket.attendeeEmail = newEmail;
    }

    await booking.save();

    res.json({ success: true, message: "Email updated successfully" });
  } catch (err) {
    console.error("[PATCH /api/bookings/edit-email]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/bookings  — legacy Razorpay booking (keep for existing bookings)
// ─────────────────────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const {
      primaryName,
      primaryRegNo,
      primaryEmail,
      attendees,
      totalAmount,
      razorpayPaymentId,
      razorpayOrderId,
    } = req.body;

    if (!primaryName || !primaryRegNo || !primaryEmail || !razorpayPaymentId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!/^\d{8}$/.test(primaryRegNo)) {
      return res.status(400).json({ error: "Registration number must be exactly 8 digits" });
    }

    if (!primaryEmail.toLowerCase().endsWith("christuniversity.in")) {
      return res.status(400).json({ error: "Email must be a Christ University email" });
    }

    const extraAttendees = Array.isArray(attendees) ? attendees : [];
    const attendeeCount = 1 + extraAttendees.length;

    let bookingId;
    let attempts = 0;
    do {
      bookingId = generateBookingId();
      attempts++;
    } while ((await Booking.exists({ bookingId })) && attempts < 10);

    const allAttendees = [
      { name: primaryName, regNo: primaryRegNo, email: primaryEmail },
      ...extraAttendees,
    ];

    const tickets = generateTickets(allAttendees);

    const booking = await Booking.create({
      bookingId,
      primaryName,
      primaryRegNo,
      primaryEmail,
      attendees: extraAttendees,
      tickets,
      attendeeCount,
      totalAmount,
      razorpayPaymentId,
      razorpayOrderId,
      paymentMethod: "razorpay",
      status: "paid",
    });

    try {
      const emailPromise = sendConfirmation(booking);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email sending timed out after 7s")), 7000)
      );
      await Promise.race([emailPromise, timeoutPromise]);
      booking.emailSent = true;
      await booking.save();
    } catch (err) {
      console.error("[Mail] Failed to send confirmation:", err.message);
    }

    res.status(201).json({
      success: true,
      bookingId: booking.bookingId,
      message: "Booking confirmed",
    });
  } catch (err) {
    console.error("[POST /api/bookings]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/bookings  — return all bookings (admin only)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/", requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    console.error("[GET /api/bookings]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/bookings/pending-reviews — bookings needing manual review (admin)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/pending-reviews", requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "pending_review" }).sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    console.error("[GET /api/bookings/pending-reviews]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/bookings/checkin  — scan QR code to check-in (admin only)
// ─────────────────────────────────────────────────────────────────────────────
router.post("/checkin", requireAdmin, async (req, res) => {
  try {
    const { ticketId } = req.body;
    if (!ticketId) {
      return res.status(400).json({ error: "ticketId is required" });
    }

    const booking = await Booking.findOneAndUpdate(
      {
        status: "paid",
        tickets: {
          $elemMatch: {
            ticketId: ticketId,
            checkedIn: false,
          },
        },
      },
      {
        $set: {
          "tickets.$.checkedIn": true,
          "tickets.$.checkedInAt": new Date(),
          "tickets.$.checkedInBy": "qr",
        },
      },
      { new: true }
    );

    if (!booking) {
      const existing = await Booking.findOne({ "tickets.ticketId": ticketId });
      if (!existing) {
        return res.status(404).json({ error: "Invalid ticket — not found" });
      }
      if (existing.status !== "paid") {
        return res.status(403).json({ 
          error: `Ticket invalid: Booking is ${existing.status.replace('_', ' ')}` 
        });
      }
      const ticket = existing.tickets.find((t) => t.ticketId === ticketId);
      return res.status(409).json({
        error: "Already checked in",
        attendeeName: ticket.attendeeName,
        attendeeRegNo: ticket.attendeeRegNo,
        checkedInAt: ticket.checkedInAt,
      });
    }

    const ticket = booking.tickets.find((t) => t.ticketId === ticketId);

    res.json({
      success: true,
      message: "Check-in successful",
      attendeeName: ticket.attendeeName,
      attendeeRegNo: ticket.attendeeRegNo,
      attendeeEmail: ticket.attendeeEmail,
      bookingId: booking.bookingId,
    });
  } catch (err) {
    console.error("[POST /api/bookings/checkin]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/bookings/manual-checkin  — manual check-in by ticket ID (admin)
// ─────────────────────────────────────────────────────────────────────────────
router.post("/manual-checkin", requireAdmin, async (req, res) => {
  try {
    const { ticketId } = req.body;
    if (!ticketId) {
      return res.status(400).json({ error: "ticketId is required" });
    }

    const booking = await Booking.findOneAndUpdate(
      {
        tickets: {
          $elemMatch: {
            ticketId: ticketId,
            checkedIn: false,
          },
        },
      },
      {
        $set: {
          "tickets.$.checkedIn": true,
          "tickets.$.checkedInAt": new Date(),
          "tickets.$.checkedInBy": "manual",
        },
      },
      { new: true }
    );

    if (!booking) {
      const existing = await Booking.findOne({ "tickets.ticketId": ticketId });
      if (!existing) {
        return res.status(404).json({ error: "Invalid ticket — not found" });
      }
      const ticket = existing.tickets.find((t) => t.ticketId === ticketId);
      return res.status(409).json({
        error: "Already checked in",
        attendeeName: ticket.attendeeName,
        attendeeRegNo: ticket.attendeeRegNo,
        checkedInAt: ticket.checkedInAt,
      });
    }

    const ticket = booking.tickets.find((t) => t.ticketId === ticketId);

    res.json({
      success: true,
      message: "Manual check-in successful",
      attendeeName: ticket.attendeeName,
      attendeeRegNo: ticket.attendeeRegNo,
      bookingId: booking.bookingId,
    });
  } catch (err) {
    console.error("[POST /api/bookings/manual-checkin]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/bookings/checkin-stats  — attendance stats (admin only)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/checkin-stats", requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "paid" });
    let totalTickets = 0;
    let checkedIn = 0;

    for (const b of bookings) {
      for (const t of b.tickets) {
        totalTickets++;
        if (t.checkedIn) checkedIn++;
      }
    }

    res.json({
      success: true,
      totalTickets,
      checkedIn,
      remaining: totalTickets - checkedIn,
    });
  } catch (err) {
    console.error("[GET /api/bookings/checkin-stats]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/bookings/all-tickets  — all tickets with check-in status (admin)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/all-tickets", requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "paid" }).sort({ createdAt: -1 });
    const tickets = [];
    for (const b of bookings) {
      for (const t of b.tickets) {
        tickets.push({
          ticketId: t.ticketId,
          bookingId: b.bookingId,
          attendeeName: t.attendeeName,
          attendeeRegNo: t.attendeeRegNo,
          attendeeEmail: t.attendeeEmail,
          checkedIn: t.checkedIn,
          checkedInAt: t.checkedInAt,
          checkedInBy: t.checkedInBy,
        });
      }
    }
    res.json({ success: true, count: tickets.length, tickets });
  } catch (err) {
    console.error("[GET /api/bookings/all-tickets]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/bookings/export?type=emails|full  — download CSV (admin only)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/export", requireAdmin, async (req, res) => {
  try {
    const type = req.query.type === "full" ? "full" : "emails";
    const bookings = await Booking.find({ status: "paid" }).sort({ createdAt: -1 });

    let csvRows = [];
    if (type === "emails") {
      csvRows.push("Name,Email,Registration Number");
      for (const b of bookings) {
        csvRows.push(`"${b.primaryName}","${b.primaryEmail}","${b.primaryRegNo}"`);
        for (const a of b.attendees) {
          csvRows.push(`"${a.name}","${a.email}","${a.regNo}"`);
        }
      }
    } else {
      csvRows.push(
        "Booking ID,Created At,Primary Name,Primary Reg No,Primary Email,Attendee Count,Total Amount (₹),Payment Method,Status,Email Sent"
      );
      for (const b of bookings) {
        csvRows.push(
          `"${b.bookingId}","${new Date(b.createdAt).toISOString()}","${b.primaryName}","${b.primaryRegNo}","${b.primaryEmail}",${b.attendeeCount},${b.totalAmount},"${b.paymentMethod || "razorpay"}","${b.status}","${b.emailSent ? "Yes" : "No"}"`
        );
      }
    }

    const csv = csvRows.join("\n");
    const filename = type === "emails" ? "Chhichhore-emails.csv" : "Chhichhore-full-report.csv";
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    console.error("[GET /api/bookings/export]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/bookings/resend-failed-emails  — send to bookings that failed (admin only)
// ─────────────────────────────────────────────────────────────────────────────
router.post("/resend-failed-emails", requireAdmin, async (req, res) => {
  try {
    const failedBookings = await Booking.find({ emailSent: { $ne: true }, status: "paid" });

    if (failedBookings.length === 0) {
      return res.json({ success: true, message: "No failed emails found. All caught up!" });
    }

    let successCount = 0;
    let failCount = 0;

    for (const booking of failedBookings) {
      try {
        await sendConfirmation(booking);
        booking.emailSent = true;
        await booking.save();
        successCount++;
      } catch (err) {
        console.error(`[Mail] Failed to resend for ${booking.bookingId}:`, err.message);
        failCount++;
      }
    }

    res.json({
      success: true,
      message: `Resent ${successCount} emails. ${failCount} still failed.`,
      successCount,
      failCount,
    });
  } catch (err) {
    console.error("[POST /api/bookings/resend-failed-emails]", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
