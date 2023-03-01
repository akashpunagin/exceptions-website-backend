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
const sendPaymentVerificationEmail = require("../../../utilities/sendPaymentVerificationEmail");
const {
  isSolvathonEventExistsForUserId,
} = require("../../../dbUtils/event/dbEventUtils");
const sendSolvathonGoogleFormEmail = require("../../../utilities/sendSolvathonGoogleFormEmail");
const {
  isUserExistsByUserId,
  getUserByUserId,
} = require("../../../dbUtils/users/dbUsersUtils");
const {
  logPaymentUpdateVerification,
} = require("../../../logs/functions/functions");

module.exports = (router) => {
  router.post(
    "/update-verification",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { participantPayment } = appConstants.SQL_TABLE;
      try {
        const { isVerified, participantId } = req.body;

        const isUserExists = await isUserExistsByUserId(participantId);
        if (!isUserExists) {
          return res.status(401).json({ error: "User does not exists" });
        }

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
            error: "User has not yet paid for the event",
          });
        }

        const updateRes = await pool.query(
          `UPDATE ${participantPayment}
          SET is_verified = $1
          WHERE participant_id = $2
          RETURNING *`,
          [isVerified, participantId]
        );
        const data = updateRes.rows[0];

        const participantUser = await getUserByUserId(participantId);

        const { firstName, lastName, email } = participantUser;
        const fullName = `${firstName} ${lastName}`;

        if (isVerified) {
          const isSuccess = await sendPaymentVerificationEmail(fullName, email);

          if (!isSuccess) {
            return res.status(401).json({
              error: "Error while sending payment verification email",
            });
          }
        }

        if (isVerified) {
          const isSolvathonExistsRes = await isSolvathonEventExistsForUserId(
            participantId
          );

          if (isSolvathonExistsRes.isError) {
            return res.status(401).json({
              error: isSolvathonExistsRes.errorMessage,
            });
          }

          const isSolvathonExists = isSolvathonExistsRes.data;

          if (isSolvathonExists) {
            const isSuccess = await sendSolvathonGoogleFormEmail(
              fullName,
              email
            );

            if (!isSuccess) {
              return res.status(401).json({
                error: "Error while sending payment verification email",
              });
            }
          }
        }

        // TODO log
        await logPaymentUpdateVerification(
          req.user.userId,
          participantId,
          isVerified
        );

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
