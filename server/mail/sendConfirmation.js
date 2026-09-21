const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Generate a QR code as a PNG buffer for the given data string.
 * @param {string} data - The data to encode
 * @returns {Promise<Buffer>}
 */
async function generateQRBuffer(data) {
  return QRCode.toBuffer(data, {
    errorCorrectionLevel: "H",
    type: "png",
    width: 280,
    margin: 2,
    color: { dark: "#1a1a1a", light: "#ffffff" },
  });
}

/**
 * Send a styled HTML confirmation email to the primary booker with QR codes.
 * @param {object} booking - The saved booking document (must include tickets[])
 */
async function sendConfirmation(booking) {
  const allAttendees = [
    { name: booking.primaryName, regNo: booking.primaryRegNo, email: booking.primaryEmail },
    ...booking.attendees,
  ];

  // Generate QR code buffers for each ticket
  const qrAttachments = [];
  const ticketCards = [];

  for (let i = 0; i < booking.tickets.length; i++) {
    const ticket = booking.tickets[i];
    const attendee = allAttendees[i] || { name: ticket.attendeeName, regNo: ticket.attendeeRegNo, email: ticket.attendeeEmail };
    const cid = `qr-ticket-${i}@inclusiverse`;

    const qrBuffer = await generateQRBuffer(ticket.ticketId);
    qrAttachments.push({
      filename: `ticket-${i + 1}.png`,
      content: qrBuffer,
      cid,
    });

    ticketCards.push(`
      <div style="background: #ffffff; border: 2px solid #f0f0f0; border-radius: 16px; overflow: hidden; margin-bottom: 16px; max-width: 320px; display: inline-block; vertical-align: top; margin-right: 16px;">
        <!-- Ticket Header -->
        <div style="background: linear-gradient(135deg, #C62828 0%, #8B0000 100%); padding: 16px 20px; text-align: center;">
          <p style="margin: 0; color: rgba(255,255,255,0.75); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Ticket ${i + 1} of ${booking.tickets.length}</p>
          <p style="margin: 4px 0 0; color: #ffffff; font-size: 16px; font-weight: 700;">${attendee.name}</p>
        </div>
        <!-- QR Code -->
        <div style="padding: 20px; text-align: center; background: #fafafa;">
          <img src="cid:${cid}" alt="Entry QR Code" width="200" height="200" style="display: block; margin: 0 auto; border-radius: 8px;" />
          <p style="margin: 12px 0 0; font-size: 11px; color: #888; line-height: 1.4;">With this QR you will get entry.<br/>This QR is single-use and becomes invalid after scan.</p>
        </div>
        <!-- Ticket Details -->
        <div style="padding: 12px 20px 16px; border-top: 1px dashed #e0e0e0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size: 11px; color: #888; padding: 3px 0;">Reg No.</td>
              <td style="font-size: 13px; color: #1a1a1a; font-weight: 600; text-align: right; font-family: monospace; padding: 3px 0;">${attendee.regNo}</td>
            </tr>
            <tr>
              <td style="font-size: 11px; color: #888; padding: 3px 0;">Email</td>
              <td style="font-size: 11px; color: #555; text-align: right; padding: 3px 0;">${attendee.email}</td>
            </tr>
          </table>
        </div>
      </div>
    `);
  }

  const attendeeRows = allAttendees
    .map(
      (a, i) => `
      <tr style="border-bottom: 1px solid #f0f0f0;">
        <td style="padding: 10px 12px; color: #555; font-size: 14px;">${i + 1}</td>
        <td style="padding: 10px 12px; color: #1a1a1a; font-size: 14px; font-weight: 500;">${a.name}</td>
        <td style="padding: 10px 12px; color: #555; font-size: 14px; font-family: monospace;">${a.regNo}</td>
        <td style="padding: 10px 12px; color: #555; font-size: 14px;">${a.email}</td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background:#f5f5f5; font-family: 'Segoe UI', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #C62828 0%, #8B0000 100%); padding: 36px 40px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 12px;">🎬</div>
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Ticket Confirmed!</h1>
              <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 15px;">Chhichhore Movie Screening</p>
            </td>
          </tr>

          <!-- Event Details -->
          <tr>
            <td style="padding: 32px 40px 0;">
              <p style="margin: 0 0 20px; font-size: 15px; color: #444; line-height: 1.6;">
                Hi <strong>${booking.primaryName}</strong>, your booking is confirmed! 🎉<br/>
                We're excited to have you join us for an evening of cinema and inclusion.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #fdf5f5; border-radius: 12px; border: 1px solid #fce4e4; overflow: hidden;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="font-size: 13px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">📅 Date & Time</span><br/>
                          <span style="font-size: 16px; color: #1a1a1a; font-weight: 600; margin-top: 4px; display: block;">1st October 2025 &bull; 9:00 PM – 11:00 PM</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="font-size: 13px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">📍 Venue</span><br/>
                          <span style="font-size: 16px; color: #1a1a1a; font-weight: 600; margin-top: 4px; display: block;">Actinity Hub</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="font-size: 13px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">🎟️ Booking ID</span><br/>
                          <span style="font-size: 18px; color: #C62828; font-weight: 700; margin-top: 4px; display: block; font-family: monospace; letter-spacing: 1px;">${booking.bookingId}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="font-size: 13px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">💳 Total Paid</span><br/>
                          <span style="font-size: 18px; color: #1a1a1a; font-weight: 700; margin-top: 4px; display: block;">₹${booking.totalAmount}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Entry QR Codes -->
          <tr>
            <td style="padding: 28px 40px 0;">
              <h3 style="margin: 0 0 6px; font-size: 15px; color: #1a1a1a; font-weight: 700;">
                🎟️ Your Entry Tickets (${booking.tickets.length})
              </h3>
              <p style="margin: 0 0 16px; font-size: 13px; color: #888; line-height: 1.5;">
                Each person needs their own QR code for entry. Show the QR at the venue — once scanned, it cannot be reused.
              </p>
              <div style="text-align: center;">
                ${ticketCards.join("")}
              </div>
            </td>
          </tr>

          <!-- Attendees Table -->
          <tr>
            <td style="padding: 28px 40px 0;">
              <h3 style="margin: 0 0 14px; font-size: 15px; color: #1a1a1a; font-weight: 700;">
                Registered Attendees (${booking.attendeeCount})
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #f0f0f0; border-radius: 10px; overflow: hidden;">
                <thead>
                  <tr style="background: #f7f7f7;">
                    <th style="padding: 10px 12px; text-align: left; font-size: 12px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">#</th>
                    <th style="padding: 10px 12px; text-align: left; font-size: 12px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Name</th>
                    <th style="padding: 10px 12px; text-align: left; font-size: 12px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Reg No</th>
                    <th style="padding: 10px 12px; text-align: left; font-size: 12px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</th>
                  </tr>
                </thead>
                <tbody>
                  ${attendeeRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Important Note -->
          <tr>
            <td style="padding: 24px 40px 0;">
              <div style="background: #fff8e1; border-radius: 10px; padding: 16px 20px; border-left: 4px solid #FFA000;">
                <p style="margin: 0; font-size: 13px; color: #555; line-height: 1.6;">
                  <strong style="color: #E65100;">📌 Important:</strong> Each QR code grants entry for <strong>one person only</strong>.
                  Show the corresponding QR code at the venue. Once scanned, it is marked as used and cannot be reused.
                  Payment is non-refundable as per our
                  <a href="#" style="color: #C62828;">No Refund Policy</a>.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; text-align: center; border-top: 1px solid #f0f0f0; margin-top: 28px;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #888;">Questions? Reach us at</p>
              <a href="mailto:inclusiverse.lavasa@christuniversity.in" style="color: #C62828; font-weight: 600; font-size: 13px; text-decoration: none;">
                inclusiverse.lavasa@christuniversity.in
              </a>
              <p style="margin: 20px 0 0; font-size: 12px; color: #bbb;">
                © 2026 Inclusiverse · Christ University Lavasa Campus
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"Inclusiverse 🎬" <${process.env.GMAIL_USER}>`,
    to: booking.primaryEmail,
    subject: `🎬 Your Chhichhore Ticket is Confirmed! [${booking.bookingId}]`,
    html,
    attachments: qrAttachments,
  });
}

module.exports = { sendConfirmation };
