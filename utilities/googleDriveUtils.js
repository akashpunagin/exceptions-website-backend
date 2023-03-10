require("dotenv").config();
const fs = require("fs");
const path = require("path");

const { google } = require("googleapis");
const {
  getRefreshToken,
} = require("../dbUtils/app_varchar_constants/dbAppVarcharConstantsUtils");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
const GOOGLE_FOLDER_ID = process.env.GOOGLE_FOLDER_ID;
const PAYMENT_SCREENSHOT_PATH = process.env.PAYMENT_SCREENSHOT_PATH;
let GOOGLE_REFRESH_TOKEN = null;

async function init() {
  const refreshToken = await getRefreshToken();
}

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL
);

getRefreshToken().then((refreshToken) => {
  GOOGLE_REFRESH_TOKEN = refreshToken;
  oauth2Client.setCredentials({ refresh_token: refreshToken });
});

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

async function uploadFileToDriveAndGetFileId(filePath, fileMimeType) {
  const fileName = path.basename(filePath);

  try {
    const uploadRes = await drive.files.create({
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

    const fileId = uploadRes.data.id;

    return { isError: false, errorMessage: null, data: fileId };
  } catch (error) {
    console.error("Upload file to google error:", error);

    return {
      isError: true,
      errorMessage:
        "There was some error while uploading image to Google Drive",
      data: null,
    };
  }
}

async function deleteLocalFile(fileName) {
  const filePath = path.join(PAYMENT_SCREENSHOT_PATH, fileName);
  const file = fs.createReadStream(filePath);
  fs.unlink(fileName, function () {
    fs.unlinkSync(filePath);
  });
}

function getFileNameFromUserId(userId) {
  return `${userId}_payment`;
}

function getFilePath() {
  return PAYMENT_SCREENSHOT_PATH;
}

async function deleteFileByFileId(fileId) {
  try {
    const delRes = await drive.files.update({
      fileId,
      resource: { trashed: true },
    });
    const fileName = delRes.data.name;
    await deleteLocalFile(fileName);

    return { isError: false, errorMessage: null, data: null };
  } catch (error) {
    console.log("DELETE FROM GOOGLE DRIVE error", error);
    return {
      isError: true,
      errorMessage: "There was some error while deleting file from google",
      data: null,
    };
  }
}

module.exports = {
  uploadFileToDriveAndGetFileId,
  deleteFileByFileId,
  getFileNameFromUserId,
  getFilePath,
};
