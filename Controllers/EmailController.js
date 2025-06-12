const { sendEmail } = require('../Models/Email');

const sendEmailController = async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'To, subject, and text are required' });
  }

  try {
    await sendEmail({ to, subject, text });
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

module.exports = { sendEmailController };
