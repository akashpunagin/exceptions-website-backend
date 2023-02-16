const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { deleteFileByFileId } = require("../../../utilities/googleDriveUtils");
const {
  isUserPaid,
} = require("../../../dbUtils/participant_payment/dbParticipantPaymentUtils");

module.exports = (router) => {
  router.post(
    "/update-verification",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { participantPayment } = appConstants.SQL_TABLE;
      try {
        const { isVerified } = req.body;

        const currentUser = req.user;

        const isPaidRes = await isUserPaid(currentUser.userId);
        if (isPaidRes.isError) {
          return res.status(401).json({
            error: isPaidRes.errorMessage,
          });
        }
        const isPaidData = isPaidRes.data;
        const { isPaid } = isPaidData;

        if (!isPaid) {
          return res.status(401).json({
            error: "User has not yet paid for the event",
          });
        }

        const updateRes = await pool.query(
          `UPDATE ${participantPayment}
          SET is_verified = $1
          WHERE participant_id = $2
          RETURNING *`,
          [isVerified, currentUser.userId]
        );
        const data = updateRes.rows[0];

        return res.status(200).json({
          status: "Payment is verified updated successfully",
          data,
        });
      } catch (error) {
        console.log("UPDATE is verified payment error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
