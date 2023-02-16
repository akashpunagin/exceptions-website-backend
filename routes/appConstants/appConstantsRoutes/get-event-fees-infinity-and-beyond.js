const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  getInfinityAndBeyondEventFees,
} = require("../../../dbUtils/app_int_constants/dbAppIntConstantsUtils");

module.exports = (router) => {
  router.get(
    "/get-event-fees-infinity-and-beyond",
    [authorization],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      try {
        const fees = await getInfinityAndBeyondEventFees();

        return res.status(200).json(fees);
      } catch (error) {
        console.log("GET get-event-fees-infinity-and-beyond error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
