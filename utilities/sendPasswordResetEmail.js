const nodemailer = require("nodemailer");

require("dotenv").config();
const BASE_URL = process.env.BASE_URL;
const FRONT_END_FORGOT_PASSWORD_URL = process.env.FRONT_END_FORGOT_PASSWORD_URL;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NODEMAILDER_EMAIL,
    pass: process.env.NODEMAILDER_PASSWORD,
  },
});

const sendPasswordResetEmail = async (name, userId, email, jwtToken) => {
  const link = `${FRONT_END_FORGOT_PASSWORD_URL}?jwtToken=${jwtToken}&userId=${userId}`;

  try {
    const temp = await transport.sendMail({
      from: process.env.NODEMAILDER_EMAIL,
      to: email,
      subject: "Password reset email",
      html: `<h1>Password Reset</h1>
            <h2>Hello ${name}</h2>
            <p>Your password reset url is ready. Please click the below link to continue</p>
            <a href=${link}> Click here</a>
            </div>`,
    });
    return true;
  } catch (error) {
    console.error("ERROR while sending password reset email", error);
    return false;
  }
};

module.exports = sendPasswordResetEmail;
