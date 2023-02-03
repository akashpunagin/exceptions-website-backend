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
      html: `
      <html lang="en" style="margin: 0; padding: 0; box-sizing: border-box">
      <head style="margin: 0; padding: 0; box-sizing: border-box">
        <meta
          charset="UTF-8"
          style="margin: 0; padding: 0; box-sizing: border-box"
        />
        <meta
          http-equiv="X-UA-Compatible"
          content="IE=edge"
          style="margin: 0; padding: 0; box-sizing: border-box"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
          style="margin: 0; padding: 0; box-sizing: border-box"
        />
    
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          style="margin: 0; padding: 0; box-sizing: border-box"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin
          style="margin: 0; padding: 0; box-sizing: border-box"
        />
    
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          style="margin: 0; padding: 0; box-sizing: border-box"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin
          style="margin: 0; padding: 0; box-sizing: border-box"
        />
    
        <title style="margin: 0; padding: 0; box-sizing: border-box">
          Document
        </title>
      </head>
      <body
        style="
          background-color: #0f172a;
          color: #fff;
          text-align: center;
          margin: 0;
          padding: 0;
          padding-top:60px;
          padding-bottom:60px;
          box-sizing: border-box;
        "
      >
        <div
          class="container"
          style="
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          "
        >
          <img
            src="https://exceptions.rvce.edu.in/assets/E1-1b9c9f8a.png"
            alt="exceptions-logo"
            style="margin: 0; padding: 0; box-sizing: border-box"
          />
          <h2
            class="heading"
            style="
              color: #38bdf8;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            "
          >
            EXCEPTIONS - 2023
          </h2>
    
          <h3
            style="margin-top: 20px; box-sizing: border-box"
          >
            Hey ${name}. You're almost there. Hang tight!
          </h3>
    
          <p
            style="
              margin-top: 20px;
              line-height: 1.7;
              font-weight: bold;
              font-size: 1.2rem;
              box-sizing: border-box;
              
            "
          >
            Please verify your email address for Exceptions - 2023. <br /> Click on the
            below link to continue
          </p>
    
          <br style="margin: 0; padding: 0; box-sizing: border-box" />
    
          <a
            href=${link}
            style="
              border: 2px solid #dca54c;
              padding: 8px 12px;
              outline: none;
              text-decoration: none;
              color: #dca54c;
              font-weight: bold;
              margin: 0;
              box-sizing: border-box;
            "
            >Verify Email
          </a>
        </div>
      </body>
    </html>
    
      `,
    });
    return true;
  } catch (error) {
    console.error("ERROR while sending confirmation email", error);
    return false;
  }
};

module.exports = sendConfirmationEmail;
