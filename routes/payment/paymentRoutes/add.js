const pool = require("../../../db/pool");
const {
  authorization,
  authorizeAdmin,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const multer = require("multer");
const { uploadFileToDrive } = require("../../../utilities/uploadToDrive");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const PAYMENT_SCREENSHOT_PATH = process.env.PAYMENT_SCREENSHOT_PATH;
const PAYMENT_SCREENSHOT_DRIVE_ERROR_PATH =
  process.env.PAYMENT_SCREENSHOT_DRIVE_ERROR_PATH;

const imageUpload = multer({
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname);

    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".pdf") {
      req.isFileUploadRes = {
        isError: true,
        errorMessage: "Invalid Media Type",
      };
    } else {
      req.isFileUploadRes = { isError: false, errorMessage: null };
    }
    callback(null, true);
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, PAYMENT_SCREENSHOT_PATH);
    },
    filename: function (req, file, cb) {
      const fileName = `${req.user.userId}_payment`;
      cb(null, fileName);
    },
  }),
});

module.exports = (router) => {
  router.get(
    "/add",
    [authorization, validateInputs, imageUpload.single("image")],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { eventMaster } = appConstants.SQL_TABLE;

      console.log("SEE :", req.isFileUploadError);
      if (req.isFileUploadRes.isError) {
        return res.status(401).json({
          error: req.isFileUploadRes.errorMessage,
        });
      }

      const filePath = req.file.path;
      const fileMimeType = req.file.mimetype;

      const uploadRes = await uploadFileToDrive(filePath, fileMimeType);
      // if error while saving file in google drive, then
      // copy the image in failure path
      if (uploadRes.isError) {
        console.error("FILE UPLOAD ERROR:", uploadRes.errorMessage);
        fs.copyFile(filePath, PAYMENT_SCREENSHOT_DRIVE_ERROR_PATH, (err) => {
          if (err) {
            console.error(
              "Error while copying file from success path to failure path"
            );
            return;
          }
          console.log("Copied file from success to failure path");
        });
      }

      try {
        return res.status(200).json({
          status: "File upload",
          data: {
            file: req.file,
          },
        });
      } catch (error) {
        console.log("DELETE Event error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
