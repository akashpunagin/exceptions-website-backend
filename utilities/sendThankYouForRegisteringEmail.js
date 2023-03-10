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

const sendThankYouForRegisteringEmail = async (name, email) => {
  const telegramLink = "http://telegram.openinapp.co/Chanel";
  const scribeLink =
    "https://scribehow.com/shared/EXCEPTIONS-2023__mNwziZsfRtiTvJExqmhZEA";
  try {
    const temp = await transport.sendMail({
      from: process.env.NODEMAILDER_EMAIL,
      to: email,
      subject: "Get Ready to Launch Your Technical Skills at Exceptions 2023!",
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
            Hey, ${name}. Your registration for Exceptions 2023 has been confirmed!
          </h3>

          <br />

          <h3 style="margin-top: 20px; box-sizing: border-box">
            Further steps:
          </h3>

          <p style="font-style:bold; margin-top: 20px; box-sizing: border-box">
          Step 1: Login to your account, and select team name and event type (Group events/Open events/Both)
          <br />Step 2: Add your team-mates
          <br />Step 3: Perform payment and upload the transaction screenshot and details
          <br />
          <br />(Step 2 and 3 can be performed simultaneously (ie You can also perform payment and add participants later)
          <br />Step 4: Wait for payment verification from coordinators of Exceptions 2023 
          <br />Step 5: Buckle up and prepare for take off! You're now a part of exclusive group of explorers!
          <br />
          <br />For detailed documentation with screenshots please have a look at the below documentation
          </p>
          <a
            href=${scribeLink}
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
            >Detailed Registartion Process
          </a>
          <h3
            style="margin-top: 20px; box-sizing: border-box"
          >
            Join our Telegram channel to get on time event updates
          </h3>
          <a
            href=${telegramLink}
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
            >Telegram Channel
          </a>
        </div>
      </body>
    </html>
    
      `,
    });
    return true;
  } catch (error) {
    console.error("ERROR while sending Thank you for registering email", error);
    return false;
  }
};

module.exports = sendThankYouForRegisteringEmail;
