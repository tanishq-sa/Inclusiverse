const mongoose = require("mongoose");

const attendeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  regNo: { type: String, required: true },
  email: { type: String, required: true },
});

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  attendeeName: { type: String, required: true },
  attendeeRegNo: { type: String, required: true },
  attendeeEmail: { type: String, required: true },
  checkedIn: { type: Boolean, default: false },
  checkedInAt: { type: Date },
  checkedInBy: { type: String }, // "qr" or "manual"
});

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  primaryName: { type: String, required: true },
  primaryRegNo: { type: String, required: true },
  primaryEmail: { type: String, required: true },
  attendees: [attendeeSchema], // additional attendees (not including primary)
  tickets: [ticketSchema], // one ticket per attendee (including primary)
  attendeeCount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  razorpayPaymentId: { type: String }, // now optional — only for legacy Razorpay bookings
  razorpayOrderId: { type: String },
  paymentMethod: { type: String, enum: ["razorpay", "gpay"], default: "gpay" },
  paymentScreenshotUrl: { type: String }, // Cloudflare R2 URL for GPay screenshot
  status: { type: String, enum: ["pending", "pending_review", "paid", "rejected"], default: "pending" },
  emailSent: { type: Boolean, default: false },
  reviewedBy: { type: String }, // admin action: "auto-ocr" or "manual"
  reviewedAt: { type: Date },
  rejectionReason: { type: String },
  ocrReasons: [{ type: String }],
  ocrConfidence: { type: String },
  ocrIsValid: { type: Boolean },
});

module.exports = mongoose.model("Booking", bookingSchema);
