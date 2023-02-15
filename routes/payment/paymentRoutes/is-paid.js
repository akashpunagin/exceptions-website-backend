const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");

module.exports = (router) => {
  router.get("/is-paid", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { participantPayment } = appConstants.SQL_TABLE;
    try {
      const currentUser = req.user;

      const getRes = await pool.query(
        `SELECT * FROM ${participantPayment}
          WHERE participant_id = $1`,
        [currentUser.userId]
      );
      const rowCount = getRes.rowCount;

      const isPaid = rowCount > 0;

      if (isPaid) {
        const rowData = getRes.rows[0];

        const {
          amount,
          transaction_id: transactionId,
          screenshot_g_drive_file_id: googleDriveFileId,
        } = rowData;

        return res.status(200).json({
          isPaid,
          data: { amount, transactionId, googleDriveFileId },
        });
      }

      return res.status(200).json({
        isPaid,
      });
    } catch (error) {
      console.log("ADD payment error", error);
      return res.status(500).json("Server error");
    }
  });
};
