const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  getShortEventDetails,
} = require("../../../scripts/getShortEventDetails");

module.exports = (router) => {
  router.get("/get-short", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { eventMaster } = appConstants.SQL_TABLE;

    try {
      const data = await getShortEventDetails();

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET Event error", error);
      return res.status(500).json("Server error");
    }
  });
};
