const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { deleteFileByFileId } = require("../../../utilities/googleDriveUtils");

module.exports = (router) => {
  router.delete(
    "/update-verification",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { participantPayment } = appConstants.SQL_TABLE;
      try {
        const { isVerified } = req.body;

        const currentUser = req.user;

        const getRes = await pool.query(
          `SELECT * FROM ${participantPayment}
        WHERE participant_id = $1`,
          [currentUser.userId]
        );
        if (getRes.rowCount === 0) {
          return res.status(401).json({
            error: "No record of payment from current user",
          });
        }
        const data = getRes.rows[0];

        const fileId = data.screenshot_g_drive_file_id;

        const deleteRes = await deleteFileByFileId(fileId);
        if (deleteRes.isError) {
          return res.status(401).json({
            error: deleteRes.errorMessage,
          });
        }

        await pool.query(
          `DELETE FROM ${participantPayment}
          WHERE participant_id = $1
          RETURNING *`,
          [currentUser.userId]
        );

        return res.status(200).json({
          status: "Payment record deleted successfully",
        });
      } catch (error) {
        console.log("DELETE payment error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
