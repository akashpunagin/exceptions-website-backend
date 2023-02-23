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
  getFileNameFromUserId,
  getFilePath,
} = require("../../../utilities/googleDriveUtils");
const path = require("path");

require("dotenv").config();

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
      cb(null, getFilePath());
    },
    filename: function (req, file, cb) {
      const fileName = getFileNameFromUserId(req.user.userId);
      cb(null, fileName);
    },
  }),
});

module.exports = (router) => {
  router.post(
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

        const getTransactionIdRes = await pool.query(
          `SELECT * FROM ${participantPayment}
          WHERE transaction_id = $1`,
          [transactionId]
        );
        const rowCountTransactionId = getTransactionIdRes.rowCount;
        if (rowCountTransactionId > 0) {
          return res.status(401).json({
            error: "Transaction id already exists",
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
        }

        const fileId = uploadRes.data;

        const addRes = await pool.query(
          `INSERT INTO ${participantPayment}(
            participant_id ,amount,
            transaction_id, 
            screenshot_g_drive_file_id,
            screenshot_mime_type
          )
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *`,
          [currentUser.userId, amount, transactionId, fileId, fileMimeType]
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
