const pool = require("../../../db/pool");
const {
  authorization,
  authorizeAdmin,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const multer = require("multer");
const {
  uploadFileToDriveAndGetFileId,
} = require("../../../utilities/googleDriveUtils");
const path = require("path");

require("dotenv").config();

const PAYMENT_SCREENSHOT_PATH = process.env.PAYMENT_SCREENSHOT_PATH;

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
    [authorization, imageUpload.single("screenshot"), validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { participantPayment } = appConstants.SQL_TABLE;
      try {
        const { amount, transactionId } = req.body;
        const currentUser = req.user;

        const getRes = await pool.query(
          `SELECT * FROM ${participantPayment}
          WHERE participant_id = $1`,
          [currentUser.userId]
        );
        const rowCount = getRes.rowCount;
        if (rowCount > 0) {
          return res.status(401).json({
            error: "Current user has already paid for the events",
          });
        }

        if (req.isFileUploadRes.isError) {
          return res.status(401).json({
            error: req.isFileUploadRes.errorMessage,
          });
        }

        const filePath = req.file.path;
        const fileMimeType = req.file.mimetype;

        const uploadRes = await uploadFileToDriveAndGetFileId(
          filePath,
          fileMimeType
        );

        if (uploadRes.isError) {
          return res.status(401).json({
            error: uploadRes.errorMessage,
          });

          //// if error while saving file in google drive, then
          //// copy the image in failure path
          // console.error("FILE UPLOAD ERROR:", uploadRes.errorMessage);
          // fs.copyFile(filePath, PAYMENT_SCREENSHOT_DRIVE_ERROR_PATH, (err) => {
          //   if (err) {
          //     console.error(
          //       "Error while copying file from success path to failure path"
          //     );
          //     return;
          //   }
          //   console.log("Copied file from success to failure path");
          // });
          ////
        }

        const fileId = uploadRes.data;

        const addRes = await pool.query(
          `INSERT INTO ${participantPayment}(
            participant_id ,amount,
            transaction_id, screenshot_g_drive_file_id
          )
          VALUES ($1, $2, $3, $4)
          RETURNING *`,
          [currentUser.userId, amount, transactionId, fileId]
        );
        const data = addRes.rows[0];

        return res.status(200).json({
          status: "Payment recorded successfully",
          data,
          gDriveUploadError: uploadRes.isError,
        });
      } catch (error) {
        console.log("ADD payment error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
