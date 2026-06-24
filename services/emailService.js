const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
};

const brandColor = '#8B2942';
const gold = '#C9A962';

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:Georgia,serif">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;margin-top:20px">
    <div style="background:${brandColor};padding:32px 40px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:28px;letter-spacing:2px">Sanskriti Market</h1>
      <p style="color:${gold};margin:4px 0 0;font-style:italic;font-size:14px">Handcrafted in India. Treasured Worldwide.</p>
    </div>
    <div style="padding:40px">${content}</div>
    <div style="background:#F5F0E8;padding:24px 40px;text-align:center;border-top:1px solid #E8DDD0">
      <p style="color:#8B7355;margin:0;font-size:13px">© ${new Date().getFullYear()} Sanskriti Market. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

const sendEmail = async (to, subject, html) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[Email stub] To: ${to} | Subject: ${subject}`);
    return true;
  }
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Sanskriti Market <noreply@sanskritimarket.com>',
      to, subject, html,
    });
    return true;
  } catch (err) {
    console.error('[Email error]', err.message);
    return false;
  }
};

const sendWelcomeEmail = async (user) => {
  const html = baseTemplate(`
    <h2 style="color:${brandColor};margin-top:0">Welcome, ${user.name}!</h2>
    <p style="color:#555;line-height:1.7">You've joined a community that celebrates India's rich craft heritage. Explore thousands of handcrafted treasures made by master artisans.</p>
    <div style="text-align:center;margin:32px 0">
      <a href="${process.env.CLIENT_URL}" style="background:${brandColor};color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px">Start Exploring</a>
    </div>
  `);
  return sendEmail(user.email, 'Welcome to Sanskriti Market 🪔', html);
};

const sendOrderConfirmation = async (order, user) => {
  const itemRows = order.items.map(item =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #F5F0E8">${item.name}</td>
     <td style="text-align:center;border-bottom:1px solid #F5F0E8">${item.quantity}</td>
     <td style="text-align:right;border-bottom:1px solid #F5F0E8">₹${item.price.toLocaleString('en-IN')}</td></tr>`
  ).join('');

  const html = baseTemplate(`
    <h2 style="color:${brandColor};margin-top:0">Order Confirmed! 🎉</h2>
    <p style="color:#555">Hi ${user.name}, your order <strong>#${order.orderNumber}</strong> has been placed successfully.</p>
    <table style="width:100%;border-collapse:collapse;margin:24px 0">
      <thead><tr style="background:#F5F0E8">
        <th style="text-align:left;padding:10px">Item</th>
        <th style="text-align:center;padding:10px">Qty</th>
        <th style="text-align:right;padding:10px">Price</th>
      </tr></thead>
      <tbody>${itemRows}</tbody>
    </table>
    <div style="background:#F5F0E8;padding:16px;border-radius:8px;margin-top:16px">
      <div style="display:flex;justify-content:space-between"><span>Subtotal</span><span>₹${order.subtotal.toLocaleString('en-IN')}</span></div>
      <div style="display:flex;justify-content:space-between"><span>Shipping</span><span>₹${order.shippingCost}</span></div>
      <div style="display:flex;justify-content:space-between"><span>Tax (5% GST)</span><span>₹${order.tax}</span></div>
      <div style="display:flex;justify-content:space-between;font-weight:bold;margin-top:8px;padding-top:8px;border-top:1px solid #C9A962"><span>Total</span><span style="color:${brandColor}">₹${order.total.toLocaleString('en-IN')}</span></div>
    </div>
    <p style="color:#555;margin-top:24px">We'll notify you when your order is shipped. Thank you for supporting Indian artisans!</p>
  `);
  return sendEmail(user.email, `Order Confirmed - #${order.orderNumber}`, html);
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password.html?token=${resetToken}`;
  const html = baseTemplate(`
    <h2 style="color:${brandColor};margin-top:0">Reset Your Password</h2>
    <p style="color:#555">We received a request to reset your password. Click the button below — this link expires in 1 hour.</p>
    <div style="text-align:center;margin:32px 0">
      <a href="${resetUrl}" style="background:${brandColor};color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px">Reset Password</a>
    </div>
    <p style="color:#999;font-size:13px">If you didn't request this, ignore this email. Your password won't change.</p>
  `);
  return sendEmail(user.email, 'Reset your Sanskriti Market password', html);
};

module.exports = { sendWelcomeEmail, sendOrderConfirmation, sendPasswordResetEmail };
