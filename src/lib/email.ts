import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface BookingConfirmationParams {
  email: string;
  name: string;
  reference: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
}

export async function sendBookingConfirmation({
  email,
  name,
  reference,
  roomName,
  checkIn,
  checkOut,
  amount,
  paymentStatus,
  paymentMethod,
}: BookingConfirmationParams) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1a365d; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
        Booking Confirmation
      </h1>
      <p>Dear ${name},</p>
      <p>Your booking has been <strong>${paymentStatus === "Paid" ? "confirmed" : "reserved"}</strong>.</p>
      <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Booking Reference:</strong> ${reference}</p>
        <p><strong>Room:</strong> ${roomName}</p>
        <p><strong>Check-in:</strong> ${checkIn}</p>
        <p><strong>Check-out:</strong> ${checkOut}</p>
        <p><strong>Total Amount:</strong> $${amount.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Payment Status:</strong> ${paymentStatus}</p>
      </div>
      <p>Thank you for choosing our hotel!</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Hotel Booking" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Booking Confirmation - ${reference}`,
    html,
  });
}

interface AdminNotificationParams {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  paymentMethod: string;
  reference: string;
}

export async function sendAdminNotification({
  guestName,
  guestEmail,
  guestPhone,
  roomName,
  checkIn,
  checkOut,
  paymentMethod,
  reference,
}: AdminNotificationParams) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1a365d; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
        New Booking Notification
      </h1>
      <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Booking Reference:</strong> ${reference}</p>
        <p><strong>Guest Name:</strong> ${guestName}</p>
        <p><strong>Guest Email:</strong> ${guestEmail}</p>
        <p><strong>Guest Phone:</strong> ${guestPhone}</p>
        <p><strong>Room:</strong> ${roomName}</p>
        <p><strong>Check-in:</strong> ${checkIn}</p>
        <p><strong>Check-out:</strong> ${checkOut}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Hotel Booking System" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Booking - ${reference}`,
    html,
  });
}
