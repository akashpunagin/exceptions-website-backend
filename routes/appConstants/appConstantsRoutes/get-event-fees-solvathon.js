const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");

module.exports = (router) => {
  router.get("/get-event-fees-solvathon", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { appIntConstants } = appConstants.SQL_TABLE;
    const label = "event_fees_solvathon";

    try {
      const intConstantsRes = await pool.query(
        `SELECT * FROM ${appIntConstants}
        WHERE label = $1`,
        [label]
      );
      const data = intConstantsRes.rows[0];
      const maxGCMemberSize = data.value;

      return res.status(200).json(maxGCMemberSize);
    } catch (error) {
      console.log("GET get-max-gc-member-size error", error);
      return res.status(500).json("Server error");
    }
  });
};
