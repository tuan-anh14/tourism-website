const nodemailer = require("nodemailer");

module.exports.sendMail = (email, subject, html) => {
  // Hỗ trợ cả 2 cấu hình: EMAIL_USER/EMAIL_PASSWORD và SMTP_USER/SMTP_PASS
  const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const emailPassword = process.env.EMAIL_PASSWORD || process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = process.env.SMTP_PORT || 587;

  // Kiểm tra cấu hình email
  if (!emailUser || !emailPassword) {
    console.error('❌ Email configuration missing:');
    console.error('EMAIL_USER/SMTP_USER:', emailUser ? '✅ Set' : '❌ Missing');
    console.error('EMAIL_PASSWORD/SMTP_PASS:', emailPassword ? '✅ Set' : '❌ Missing');
    throw new Error('Email configuration is missing. Please check EMAIL_USER/EMAIL_PASSWORD or SMTP_USER/SMTP_PASS environment variables.');
  }

  console.log('📧 Email configuration:');
  console.log('User:', emailUser);
  console.log('Host:', smtpHost);
  console.log('Port:', smtpPort);

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });

  const mailOptions = {
    from: emailUser,
    to: email,
    subject: subject,
    html: html,
  };

  console.log('📤 Sending email to:', email);
  console.log('📤 Subject:', subject);

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error('❌ Email sending failed:', error);
      throw error; // Throw error để controller có thể catch
    } else {
      console.log('✅ Email sent successfully:', info.response);
    }
  });
};
