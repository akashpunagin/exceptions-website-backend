const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  getAllGroupEventsFees,
} = require("../../../dbUtils/app_int_constants/dbAppIntConstantsUtils");

module.exports = (router) => {
  router.get(
    "/get-event-fees-all-group-events",
    [authorization],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      try {
        const fees = await getAllGroupEventsFees();

        return res.status(200).json(fees);
      } catch (error) {
        console.log("GET get-event-fees-all-group-events error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
