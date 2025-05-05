const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { fullName, email, phone, subject, message } = req.body;

  // Validate required fields
  if (!fullName || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Configure Nodemailer transporter (using Gmail as an example)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like 'sendgrid', 'mailgun', etc.
    auth: {
      user: process.env.EMAIL_USER, // Your email address (e.g., your-email@gmail.com)
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address (your email)
    to: 'tutorhub1111@gmail.com', // Recipient email (your email)
    replyTo: email, // User's email, so replies go to them
    subject: `New Message: ${subject}`,
    text: `
      Full Name: ${fullName}
      Email: ${email}
      Phone: ${phone || 'Not provided'}
      Subject: ${subject}
      Message: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
}