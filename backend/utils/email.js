const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);


// Send email verification OTP
const sendVerificationEmail = async (toEmail, userName, otp) => {
  await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: toEmail,
    subject: 'Verify your Book Haven account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a;">Welcome to BookStore, ${userName}! 👋</h2>
        <p style="color: #555;">Use the OTP below to verify your email address. It expires in <strong>10 minutes</strong>.</p>
        
        <div style="background: #f4f4f4; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
          <h1 style="color: #4F46E5; letter-spacing: 8px; font-size: 36px; margin: 0;">${otp}</h1>
        </div>

        <p style="color: #999; font-size: 13px;">If you didn't create a BookHaven account, ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">© 2026 BookHaven. All rights reserved.</p>
      </div>
    `,
  });
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (toEmail, userName, order) => {

  // DEV BYPASS
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV] Order confirmation email skipped for ${toEmail}`);
    return;
  }

  const itemsList = order.items.map(item => `
  <tr>
    <td style="padding: 8px; border-bottom: 1px solid #eee;">
      ${item.bookId?.title || 'Unknown Book'}  
    </td>
    <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:center;">
      ${item.quantity}
    </td>
    <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:right;">
      Rs.${item.price}  
    </td>
  </tr>
`).join('');

  await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: toEmail,
    subject: `Order Confirmed #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a;">Order Confirmed!</h2>
        <p>Hi ${userName}, your order has been placed successfully.</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f4f4f4;">
              <th style="padding: 8px; text-align:left;">Book</th>
              <th style="padding: 8px;">Qty</th>
              <th style="padding: 8px; text-align:right;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsList}</tbody>
        </table>

        <p style="font-size: 16px;"><strong>Total: Rs.${order.totalAmount}</strong></p>
        <p style="color: #555;">We'll notify you when your order is shipped.</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">© 2026 BookHaven. All rights reserved.</p>
      </div>
    `,
  });
};

// Send order status update email
const sendOrderStatusEmail = async (toEmail, userName, orderId, status) => {

  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV] Status email skipped for ${toEmail} → ${status}`);
    return;
  }

  const statusColors = {
    confirmed: '#3B82F6',
    processing: '#F59E0B',
    shipped: '#8B5CF6',
    delivered: '#10B981',
    cancelled: '#EF4444',
  };

  await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: toEmail,
    subject: `Order #${orderId} is now ${status.toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a;">Order Update </h2>
        <p>Hi ${userName}, your order status has been updated.</p>

        <div style="background: #f4f4f4; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
          <p style="margin: 0; color: #555;">Order <strong>#${orderId}</strong> is now</p>
          <h2 style="color: ${statusColors[status] || '#1a1a1a'}; margin: 8px 0; text-transform: uppercase;">
            ${status}
          </h2>
        </div>

        <p style="color: #999; font-size: 13px;">Thank you for shopping with BookStore!</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">© 2026 BookHaven. All rights reserved.</p>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail, sendOrderConfirmationEmail, sendOrderStatusEmail };