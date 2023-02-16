const pool = require("../../../db/pool");
const {
  isUserPaid,
} = require("../../../dbUtils/participant_payment/dbParticipantPaymentUtils");
const { authorization } = require("../../../middleware/exportMiddlewares");

module.exports = (router) => {
  router.get("/is-paid", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    try {
      const currentUser = req.user;

      const isPaidRes = await isUserPaid(currentUser.userId);
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
      console.log("IS PAID error", error);
      return res.status(500).json("Server error");
    }
  });
};
