import config from '@/config';
import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

transporter = nodemailer.createTransport({
  host: config.nodemailer.host,
  port: config.nodemailer.port,
  secure: true,
  auth: {
    user: config.nodemailer.username,
    pass: config.nodemailer.password,
  },
});

interface IMailPayload {
  to?: string;
  from?: string;
  subject?: string;
  html?: string;
}

const sendEmail = async (payload: IMailPayload) => {
  if (!transporter) {
    console.error('Attempted to send email, but email service is not configured.');
    return;
  }
  const mailOptions = {
    from: payload.from || config.nodemailer.from,
    to: payload.to,
    subject: payload.subject || `Email from ${config.app_name}.`,
    html: payload.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent to:', payload.to || payload.from);
  } catch (error) {
    console.error('Error sending  email:', error);
    throw new Error('Could not send email.');
  }
};

export default sendEmail;
