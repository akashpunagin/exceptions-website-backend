const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  getSolvathonEventFees,
} = require("../../../dbUtils/app_int_constants/dbAppIntConstantsUtils");

module.exports = (router) => {
  router.get("/get-event-fees-solvathon", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { appIntConstants } = appConstants.SQL_TABLE;
    const label = "event_fees_solvathon";

    try {
      const fees = await getSolvathonEventFees();

      return res.status(200).json(fees);
    } catch (error) {
      console.log("GET get-event-fees-solvathon error", error);
      return res.status(500).json("Server error");
    }
  });
};
