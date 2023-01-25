const nodemailer = require("nodemailer");

require("dotenv").config();
const BASE_URL = process.env.BASE_URL;
const FORNT_END_EMAIL_CONFIRMATION_URL =
  process.env.FORNT_END_EMAIL_CONFIRMATION_URL;

const transport = nodemailer.createTransport({
  // if normal password is used
  ignoreTLS: false,
  secure: false,

  service: "Gmail",
  auth: {
    user: process.env.NODEMAILDER_EMAIL,
    pass: process.env.NODEMAILDER_PASSWORD,
  },
});

const sendConfirmationEmail = async (name, email, jwtToken) => {
  const link = `${FORNT_END_EMAIL_CONFIRMATION_URL}?jwtToken=${jwtToken}`;

  try {
    const temp = await transport.sendMail({
      from: process.env.NODEMAILDER_EMAIL,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
            <h2>Hello ${name}</h2>
            <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
            <a href=${link}> Click here</a>
            </div>`,
    });
    return true;
  } catch (error) {
    console.error("ERROR while sending confirmation email", error);
    return false;
  }
};

module.exports = sendConfirmationEmail;
