const pool = require("../../../db/pool");
const {
  isUserPaid,
} = require("../../../dbUtils/participant_payment/dbParticipantPaymentUtils");
const { isUserExistsByUserId } = require("../../../dbUtils/users/dbUsersUtils");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");

module.exports = (router) => {
  router.post(
    "/is-participant-paid",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      try {
        const { participantId } = req.body;

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
        const { isPaid, paymentData } = isPaidData;

        if (isPaid) {
          return res.status(200).json({
            isPaid,
            paymentData,
          });
        }

        return res.status(200).json({
          isPaid,
        });
      } catch (error) {
        console.log("IS USER PAID error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
