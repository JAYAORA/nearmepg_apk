/**
 * Email service using Resend.
 * Set RESEND_EMAIL_API_KEY in your .env.local file.
 * Set RESEND_FROM_EMAIL to your verified sender (e.g. "NearMePG <noreply@yourdomain.com>")
 */
import { Resend } from "resend";

const apiKey = process.env.RESEND_EMAIL_API_KEY || "re_dummy_key_to_prevent_crash";
const resend = new Resend(apiKey);
const FROM = process.env.RESEND_FROM_EMAIL || "NearMePG <noreply@nearmepg.com>";
const isResendConfigured = !!process.env.RESEND_EMAIL_API_KEY;

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

// ── Email Templates ──────────────────────────────────────────────────────────

export async function sendBookingConfirmationTenant(opts: {
  to: string;
  tenantName: string;
  bookingCode: string;
  propertyName: string;
  roomName: string;
  bedId?: string;
  checkIn?: string;
  checkOut?: string;
  amountPaid: number;
}) {
  if (!isResendConfigured) {
    console.warn("RESEND_EMAIL_API_KEY not configured. Skipping email to:", opts.to);
    return;
  }
  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `✅ Booking Confirmed — ${opts.bookingCode}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
        <div style="background:linear-gradient(135deg,#d97706,#ea580c);padding:32px;border-radius:16px 16px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">Booking Confirmed!</h1>
          <p style="color:#fde68a;margin:8px 0 0;font-size:14px">Your stay is all set.</p>
        </div>
        <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:32px;border-radius:0 0 16px 16px">
          <p style="margin:0 0 8px">Hi <strong>${opts.tenantName}</strong>,</p>
          <p style="color:#64748b;font-size:14px;margin:0 0 24px">Your booking at <strong>${opts.propertyName}</strong> is confirmed.</p>
          
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px;color:#64748b;border-bottom:1px solid #f1f5f9">Booking Code</td><td style="padding:8px;font-weight:600;font-family:monospace;border-bottom:1px solid #f1f5f9">${opts.bookingCode}</td></tr>
            <tr><td style="padding:8px;color:#64748b;border-bottom:1px solid #f1f5f9">Room</td><td style="padding:8px;border-bottom:1px solid #f1f5f9">${opts.roomName}${opts.bedId ? ` · Bed ${opts.bedId}` : ""}</td></tr>
            <tr><td style="padding:8px;color:#64748b;border-bottom:1px solid #f1f5f9">Check-In</td><td style="padding:8px;border-bottom:1px solid #f1f5f9">${fmtDate(opts.checkIn)}</td></tr>
            <tr><td style="padding:8px;color:#64748b;border-bottom:1px solid #f1f5f9">Check-Out</td><td style="padding:8px;border-bottom:1px solid #f1f5f9">${fmtDate(opts.checkOut)}</td></tr>
            <tr><td style="padding:8px;color:#64748b">Amount Paid</td><td style="padding:8px;font-weight:700;color:#16a34a">₹${opts.amountPaid.toLocaleString("en-IN")}</td></tr>
          </table>
          
          <div style="margin-top:24px;padding:16px;background:#fefce8;border:1px solid #fde68a;border-radius:12px;font-size:13px;color:#92400e">
            💡 You can view your booking details anytime at <a href="https://nearmepg.com/account/bookings" style="color:#d97706">My Bookings</a>.
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendBookingNotificationOwner(opts: {
  to: string;
  ownerName: string;
  tenantName: string;
  tenantEmail: string;
  bookingCode: string;
  propertyName: string;
  roomName: string;
  checkIn?: string;
  checkOut?: string;
}) {
  if (!isResendConfigured) {
    console.warn("RESEND_EMAIL_API_KEY not configured. Skipping email to:", opts.to);
    return;
  }
  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `🏠 New Booking — ${opts.tenantName} at ${opts.propertyName}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
        <div style="background:#0f172a;padding:32px;border-radius:16px 16px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">New Booking Received</h1>
          <p style="color:#94a3b8;margin:8px 0 0;font-size:14px">${opts.propertyName}</p>
        </div>
        <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:32px;border-radius:0 0 16px 16px">
          <p style="margin:0 0 8px">Hi <strong>${opts.ownerName}</strong>,</p>
          <p style="color:#64748b;font-size:14px;margin:0 0 24px">A new tenant has booked a room at your property.</p>
          
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px;color:#64748b;border-bottom:1px solid #f1f5f9">Tenant</td><td style="padding:8px;border-bottom:1px solid #f1f5f9">${opts.tenantName} (${opts.tenantEmail})</td></tr>
            <tr><td style="padding:8px;color:#64748b;border-bottom:1px solid #f1f5f9">Room</td><td style="padding:8px;border-bottom:1px solid #f1f5f9">${opts.roomName}</td></tr>
            <tr><td style="padding:8px;color:#64748b;border-bottom:1px solid #f1f5f9">Check-In</td><td style="padding:8px;border-bottom:1px solid #f1f5f9">${fmtDate(opts.checkIn)}</td></tr>
            <tr><td style="padding:8px;color:#64748b">Booking Code</td><td style="padding:8px;font-family:monospace;font-weight:600">${opts.bookingCode}</td></tr>
          </table>
          
          <div style="margin-top:24px">
            <a href="https://nearmepg.com/owner/tenants" style="display:inline-block;background:#d97706;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px">View in My Tenants →</a>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendBookingCancelledEmail(opts: {
  to: string;
  recipientName: string;
  bookingCode: string;
  propertyName: string;
  reason?: string;
  cancelledBy: "tenant" | "owner";
}) {
  if (!isResendConfigured) {
    console.warn("RESEND_EMAIL_API_KEY not configured. Skipping email to:", opts.to);
    return;
  }
  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `❌ Booking Cancelled — ${opts.bookingCode}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
        <div style="background:#dc2626;padding:32px;border-radius:16px 16px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">Booking Cancelled</h1>
        </div>
        <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:32px;border-radius:0 0 16px 16px">
          <p style="margin:0 0 8px">Hi <strong>${opts.recipientName}</strong>,</p>
          <p style="color:#64748b;font-size:14px;margin:0 0 16px">
            The booking <strong>${opts.bookingCode}</strong> at <strong>${opts.propertyName}</strong> has been cancelled by the ${opts.cancelledBy}.
          </p>
          ${opts.reason ? `<p style="color:#64748b;font-size:14px">Reason: <em>${opts.reason}</em></p>` : ""}
          <p style="color:#64748b;font-size:13px;margin-top:16px">If a refund is applicable, it will be processed by the property owner. Contact them directly if needed.</p>
        </div>
      </div>
    `,
  });
}

export async function sendEarlyCheckoutEmail(opts: {
  to: string;
  recipientName: string;
  bookingCode: string;
  propertyName: string;
  actualCheckoutDate: string;
}) {
  if (!isResendConfigured) {
    console.warn("RESEND_EMAIL_API_KEY not configured. Skipping email to:", opts.to);
    return;
  }
  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `🏁 Checkout Processed — ${opts.bookingCode}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
        <div style="background:#059669;padding:32px;border-radius:16px 16px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">Checkout Processed</h1>
        </div>
        <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:32px;border-radius:0 0 16px 16px">
          <p style="margin:0 0 8px">Hi <strong>${opts.recipientName}</strong>,</p>
          <p style="color:#64748b;font-size:14px">The early checkout for booking <strong>${opts.bookingCode}</strong> at <strong>${opts.propertyName}</strong> has been processed.</p>
          <p style="color:#64748b;font-size:14px">Actual checkout date: <strong>${fmtDate(opts.actualCheckoutDate)}</strong></p>
        </div>
      </div>
    `,
  });
}

export async function sendRentReminderEmail(opts: {
  to: string;
  tenantName: string;
  propertyName: string;
  roomName: string;
  dueDate: string;
  amount?: number;
}) {
  if (!isResendConfigured) {
    console.warn("RESEND_EMAIL_API_KEY not configured. Skipping email to:", opts.to);
    return;
  }
  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `💰 Rent Reminder — Due ${fmtDate(opts.dueDate)}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
        <div style="background:#7c3aed;padding:32px;border-radius:16px 16px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">Rent Reminder</h1>
          <p style="color:#ddd6fe;margin:8px 0 0;font-size:14px">${opts.propertyName}</p>
        </div>
        <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:32px;border-radius:0 0 16px 16px">
          <p style="margin:0 0 8px">Hi <strong>${opts.tenantName}</strong>,</p>
          <p style="color:#64748b;font-size:14px">Your rent for <strong>${opts.roomName}</strong> at <strong>${opts.propertyName}</strong> is due on <strong>${fmtDate(opts.dueDate)}</strong>.</p>
          ${opts.amount ? `<p style="font-size:24px;font-weight:700;color:#7c3aed;margin:16px 0">₹${opts.amount.toLocaleString("en-IN")}</p>` : ""}
          <p style="color:#64748b;font-size:13px">Please contact your property owner to make the payment.</p>
        </div>
      </div>
    `,
  });
}

export async function sendOwnerApprovedEmail(opts: {
  to: string;
  name: string;
}) {
  if (!isResendConfigured) {
    console.warn("RESEND_EMAIL_API_KEY not configured. Skipping email to:", opts.to);
    return;
  }
  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: `🎉 Your owner account has been approved — NearMePG`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
        <div style="background:linear-gradient(135deg,#d97706,#ea580c);padding:32px;border-radius:16px 16px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px">Account Approved!</h1>
        </div>
        <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:32px;border-radius:0 0 16px 16px">
          <p style="margin:0 0 8px">Hi <strong>${opts.name}</strong>,</p>
          <p style="color:#64748b;font-size:14px">Your PG/Hotel owner account on NearMePG has been approved. You can now log in and start listing your properties.</p>
          <div style="margin-top:24px">
            <a href="https://nearmepg.com/login" style="display:inline-block;background:#d97706;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px">Login & List Properties →</a>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(opts: {
  to: string;
  recipientName: string;
}) {
  if (!isResendConfigured) {
    console.warn("RESEND_EMAIL_API_KEY not configured. Skipping welcome email to:", opts.to);
    return;
  }
  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: "Welcome to NearMePG! 🎉",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
        <div style="background:linear-gradient(135deg,#047857,#059669);padding:32px;border-radius:16px 16px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:26px">Welcome to NearMePG!</h1>
          <p style="color:#a7f3d0;margin:8px 0 0;font-size:15px">Your smart accommodation partner.</p>
        </div>
        <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:32px;border-radius:0 0 16px 16px">
          <p style="margin:0 0 8px">Hi <strong>${opts.recipientName}</strong>,</p>
          <p style="color:#64748b;font-size:15px;line-height:1.6;margin:0 0 24px">
            Thank you for creating an account with NearMePG! We're thrilled to have you on board.
            Whether you're looking for your next comfortable stay or listing a property, we are here to make the process completely seamless and transparent.
          </p>
          
          <div style="margin-bottom:24px">
            <h3 style="margin:0 0 8px;font-size:16px;color:#0f172a">What's next?</h3>
            <ul style="color:#64748b;font-size:14px;line-height:1.6;margin:0;padding-left:20px">
              <li><strong>Complete your KYC:</strong> Verify your identity securely via your profile.</li>
              <li><strong>Find a PG:</strong> Explore available rooms with live bed-level availability.</li>
              <li><strong>Instant Booking:</strong> Pay securely and secure your bed immediately.</li>
            </ul>
          </div>
          
          <div style="margin-top:32px;text-align:center">
            <a href="https://nearmepg.com/" style="display:inline-block;background:#059669;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">Start Exploring →</a>
          </div>
          
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0"/>
          
          <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0">
            © ${new Date().getFullYear()} NearMePG. All rights reserved.<br/>
            Need help? Contact us at support@nearmepg.com
          </p>
        </div>
      </div>
    `,
  });
}
