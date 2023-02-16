const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  getFileNameFromUserId,
  getFilePath,
} = require("../../../utilities/googleDriveUtils");
const {
  isUserPaid,
} = require("../../../dbUtils/participant_payment/dbParticipantPaymentUtils");
const path = require("path");
const fs = require("fs");

module.exports = (router) => {
  router.post(
    "/get-screenshot-by-user-id",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { participantPayment } = appConstants.SQL_TABLE;
      try {
        const { participantId } = req.body;

        const isPaidRes = await isUserPaid(participantId);
        if (isPaidRes.isError) {
          return res.status(401).json({
            error: isPaidRes.errorMessage,
          });
        }
        const isPaidData = isPaidRes.data;
        const { isPaid } = isPaidData;

        if (!isPaid) {
          return res.status(401).json({
            error: "Participant has not yet paid for the event",
          });
        }

        const getRes = await pool.query(
          `SELECT * FROM ${participantPayment}
          WHERE participant_id = $1`,
          [participantId]
        );
        const data = getRes.rows[0];
        const fileMimeType = data.screenshot_mime_type;

        const fileName = getFileNameFromUserId(participantId);
        const filePath = getFilePath();

        const fullFilePath = path.join(filePath, fileName);

        const file = fs.createReadStream(fullFilePath);
        const stat = fs.statSync(fullFilePath);

        res.setHeader("Content-Length", stat.size);
        console.log({ stat });

        res.setHeader("Content-Type", fileMimeType);
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${fileName}`
        );
        file.pipe(res);

        return res.status(200);
      } catch (error) {
        console.log("GET screenshot of payment error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
