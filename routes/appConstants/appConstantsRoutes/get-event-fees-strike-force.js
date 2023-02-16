const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  getStrikeForceFees,
} = require("../../../dbUtils/app_int_constants/dbAppIntConstantsUtils");

module.exports = (router) => {
  router.get(
    "/get-event-fees-strike-force",
    [authorization],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { appIntConstants } = appConstants.SQL_TABLE;
      const label = "event_fees_strike_force";

      try {
        const fees = await getStrikeForceFees();

        return res.status(200).json(fees);
      } catch (error) {
        console.log("GET get-event-fees-strike-force error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
