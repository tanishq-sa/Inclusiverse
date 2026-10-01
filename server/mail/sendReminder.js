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

async function sendReminder(booking) {
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
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Event Reminder!</h1>
              <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 15px;">Chhichhore Movie Screening</p>
            </td>
          </tr>

          <!-- Message Details -->
          <tr>
            <td style="padding: 32px 40px 20px;">
              <p style="margin: 0 0 20px; font-size: 15px; color: #444; line-height: 1.6;">
                Hi <strong>${booking.primaryName}</strong>,<br/><br/>
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

  // Thread as a reply to the original confirmation email if possible
  const originalSubject = `🎬 Your Chhichhore Ticket is Confirmed! [${booking.bookingId}]`;

  const mailOptions = {
    from: `"Inclusiverse 🎬" <${process.env.GMAIL_USER}>`,
    to: booking.primaryEmail,
    subject: booking.emailMessageId
      ? `Re: ${originalSubject}`
      : `Reminder: Your Chhichhore Ticket [${booking.bookingId}]`,
    html,
  };

  if (booking.emailMessageId) {
    mailOptions.inReplyTo = booking.emailMessageId;
    mailOptions.references = [booking.emailMessageId];
  }

  const info = await transporter.sendMail(mailOptions);
  return info;
}

module.exports = { sendReminder };
