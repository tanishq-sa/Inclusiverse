const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Booking = require("../models/Booking");
const { sendConfirmation } = require("../mail/sendConfirmation");

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

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/bookings  — create a booking after successful Razorpay payment
// ─────────────────────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const {
      primaryName,
      primaryRegNo,
      primaryEmail,
      attendees,          // array of { name, regNo, email }
      totalAmount,
      razorpayPaymentId,
      razorpayOrderId,
    } = req.body;

    // Basic validation
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

    // Generate unique booking ID (retry on collision)
    let bookingId;
    let attempts = 0;
    do {
      bookingId = generateBookingId();
      attempts++;
    } while ((await Booking.exists({ bookingId })) && attempts < 10);

    // Generate tickets — one per attendee (primary + extras)
    const allAttendees = [
      { name: primaryName, regNo: primaryRegNo, email: primaryEmail },
      ...extraAttendees,
    ];

    const tickets = allAttendees.map((a) => ({
      ticketId: uuidv4(),
      attendeeName: a.name,
      attendeeRegNo: a.regNo,
      attendeeEmail: a.email,
      checkedIn: false,
    }));

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
      status: "paid",
    });

    // Send confirmation email (non-blocking: don't fail booking if mail fails)
    sendConfirmation(booking).catch((err) =>
      console.error("[Mail] Failed to send confirmation:", err.message)
    );

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
// POST /api/bookings/checkin  — scan QR code to check-in (admin only)
// ─────────────────────────────────────────────────────────────────────────────
router.post("/checkin", requireAdmin, async (req, res) => {
  try {
    const { ticketId } = req.body;
    if (!ticketId) {
      return res.status(400).json({ error: "ticketId is required" });
    }

    const booking = await Booking.findOne({ "tickets.ticketId": ticketId });
    if (!booking) {
      return res.status(404).json({ error: "Invalid ticket — not found" });
    }

    const ticket = booking.tickets.find((t) => t.ticketId === ticketId);
    if (ticket.checkedIn) {
      return res.status(409).json({
        error: "Already checked in",
        attendeeName: ticket.attendeeName,
        attendeeRegNo: ticket.attendeeRegNo,
        checkedInAt: ticket.checkedInAt,
      });
    }

    ticket.checkedIn = true;
    ticket.checkedInAt = new Date();
    ticket.checkedInBy = "qr";
    await booking.save();

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

    const booking = await Booking.findOne({ "tickets.ticketId": ticketId });
    if (!booking) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const ticket = booking.tickets.find((t) => t.ticketId === ticketId);
    if (ticket.checkedIn) {
      return res.status(409).json({
        error: "Already checked in",
        attendeeName: ticket.attendeeName,
        checkedInAt: ticket.checkedInAt,
      });
    }

    ticket.checkedIn = true;
    ticket.checkedInAt = new Date();
    ticket.checkedInBy = "manual";
    await booking.save();

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
    const bookings = await Booking.find();
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
    const bookings = await Booking.find().sort({ createdAt: -1 });
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
    const bookings = await Booking.find().sort({ createdAt: -1 });

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
        "Booking ID,Created At,Primary Name,Primary Reg No,Primary Email,Attendee Count,Total Amount (₹),Razorpay Payment ID,Status"
      );
      for (const b of bookings) {
        csvRows.push(
          `"${b.bookingId}","${new Date(b.createdAt).toISOString()}","${b.primaryName}","${b.primaryRegNo}","${b.primaryEmail}",${b.attendeeCount},${b.totalAmount},"${b.razorpayPaymentId}","${b.status}"`
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

module.exports = router;
