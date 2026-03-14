import nodemailer from "nodemailer";

export async function sendVerificationEmail(to, code) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "CampusLoop Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #1a1a1a;">
        <h2 style="color: #005a8b;">CampusLoop</h2>
        <p>Your verification code is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #005a8b;">
          ${code}
        </div>
        <p>This code expires in 15 minutes.</p>
      </div>
    `
  });
}