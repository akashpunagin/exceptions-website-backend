const multer = require("multer");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const { google } = require("googleapis");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const GOOGLE_FOLDER_ID = "1xhcyNZ9Q2jQGcR4bNehV9t6u7cXhGRWH";

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL
);

oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

function refreshToken() {
  oauth2Client.refreshAccessToken(function (err, tokens) {
    console.log({ tokens, err });
    const { access_token: accessToken, refresh_token: refreshToken } = tokens;
    console.log({ accessToken, refreshToken });
  });
}

async function uploadFileToDrive(filePath, fileMimeType) {
  const fileName = path.basename(filePath);

  try {
    await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: fileMimeType,
        parents: [GOOGLE_FOLDER_ID],
      },
      media: {
        mimeType: fileMimeType,
        body: fs.createReadStream(filePath),
      },
    });
    return { isError: false, errorMessage: null };
  } catch (error) {
    console.error("Upload file to google error:", error);
    return {
      isError: true,
      errorMessage:
        "There was some error while uploading image to Google Drive",
    };
  }
}

module.exports = { uploadFileToDrive };
