const nodemailer = require("nodemailer");
require("dotenv").config();
const BASE_URL = process.env.BASE_URL;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NODEMAILDER_EMAIL,
    pass: process.env.NODEMAILDER_PASSWORD,
  },
});

const sendPaymentVerificationEmail = async (name, email) => {
  try {
    const temp = await transport.sendMail({
      from: process.env.NODEMAILDER_EMAIL,
      to: email,
      subject: "Payment Verification Successful",
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
          padding-top:60px ;
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
            Hey, ${name}. Your payment has been verified by the Exceptions 2023 coordinators!
          </h3>
        </div>
      </body>
    </html>
    
      `,
    });
    return true;
  } catch (error) {
    console.error("ERROR while sending payment verification email", error);
    return false;
  }
};

module.exports = sendPaymentVerificationEmail;
