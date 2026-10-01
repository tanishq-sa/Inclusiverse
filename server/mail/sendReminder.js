const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000,
});

/**
 * Build the reminder HTML for a given attendee name.
 */
function buildReminderHtml(attendeeName, booking) {
  return `
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
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Event Reminder!</h1>
              <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 15px;">Chhichhore Movie Screening</p>
            </td>
          </tr>

          <!-- Quick-Glance Info -->
          <tr>
            <td style="padding: 28px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #fdf5f5; border-radius: 12px; border: 1px solid #fce4e4; overflow: hidden;">
                <tr>
                  <td style="padding: 18px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 6px 0;">
                          <span style="font-size: 12px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">📅 Date & Time</span><br/>
                          <span style="font-size: 15px; color: #1a1a1a; font-weight: 600; margin-top: 2px; display: block;">1st October 2025 &bull; 7:00 PM</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0;">
                          <span style="font-size: 12px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">📍 Venue</span><br/>
                          <span style="font-size: 15px; color: #1a1a1a; font-weight: 600; margin-top: 2px; display: block;">Activity Hub</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0;">
                          <span style="font-size: 12px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">🎟️ Booking ID</span><br/>
                          <span style="font-size: 16px; color: #C62828; font-weight: 700; margin-top: 2px; display: block; font-family: monospace; letter-spacing: 1px;">${booking.bookingId}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Details -->
          <tr>
            <td style="padding: 24px 40px 20px;">
              <p style="margin: 0 0 20px; font-size: 15px; color: #444; line-height: 1.6;">
                Hi <strong>${attendeeName}</strong>,<br/><br/>
                This is a friendly reminder that the <strong>Chhichhore movie screening</strong> is happening today!
              </p>
              
              <div style="background: #fff8e1; border-radius: 10px; padding: 16px 20px; border-left: 4px solid #FFA000; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 13px; color: #555; line-height: 1.6;">
                  <strong style="color: #E65100;">📌 Important:</strong> We are super excited to host you. Please make sure to have your original confirmation email with the QR codes ready for a smooth check-in process at the venue (Activity Hub) starting at 7:00 PM.
                </p>
              </div>

              <p style="margin: 0 0 20px; font-size: 15px; color: #444; line-height: 1.6;">
                See you soon!<br/>
                <strong>- Inclusiverse Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; text-align: center; border-top: 1px solid #f0f0f0;">
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
}

/**
 * Send reminder emails to ALL attendees of a booking (primary + extras).
 * Returns { sent: string[], failed: string[] } with email addresses.
 */
async function sendReminder(booking) {
  // Collect all attendees: primary + extras
  const allAttendees = [
    { name: booking.primaryName, email: booking.primaryEmail },
    ...booking.attendees.map((a) => ({ name: a.name, email: a.email })),
  ];

  // Deduplicate by email (in case primary is also listed in attendees)
  const seen = new Set();
  const uniqueAttendees = allAttendees.filter((a) => {
    const key = a.email.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const sent = [];
  const failed = [];

  // Thread as a reply to the original confirmation email if possible
  const originalSubject = `🎬 Your Chhichhore Ticket is Confirmed! [${booking.bookingId}]`;

  for (const attendee of uniqueAttendees) {
    try {
      const html = buildReminderHtml(attendee.name, booking);

      const mailOptions = {
        from: `"Inclusiverse 🎬" <${process.env.GMAIL_USER}>`,
        to: attendee.email,
        subject: booking.emailMessageId
          ? `Re: ${originalSubject}`
          : `Reminder: Your Chhichhore Ticket [${booking.bookingId}]`,
        html,
      };

      if (booking.emailMessageId) {
        mailOptions.inReplyTo = booking.emailMessageId;
        mailOptions.references = [booking.emailMessageId];
      }

      await transporter.sendMail(mailOptions);
      sent.push(attendee.email);
    } catch (err) {
      console.error(`[Mail] Failed to send reminder to ${attendee.email} (${booking.bookingId}):`, err.message);
      failed.push(attendee.email);
    }
  }

  return { sent, failed };
}

module.exports = { sendReminder };
