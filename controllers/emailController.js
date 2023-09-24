const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "ravikumarqw@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (name, email, subject, content) => {
  try {
    const mailOptions = {
      from: "ravikumarqw@gmail.com",
      to: "shubh.manu44@gmail.com",
      subject: subject,
      text: `Name: ${name}\nEmail: ${email}\nContent: ${content}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

module.exports = {
  sendEmail,
};
