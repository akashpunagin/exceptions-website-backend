const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");

module.exports = (router) => {
  router.post(
    "/update-event-fees-solvathon",
    [authorization],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { appIntConstants } = appConstants.SQL_TABLE;
      const label = "event_fees_solvathon";

      try {
        const { fees } = req.body;

        const intConstantsRes = await pool.query(
          `UPDATE ${appIntConstants}
          SET value = $2
          WHERE label = $1
          RETURNING *`,
          [label, fees]
        );
        const data = intConstantsRes.rows[0];

        return res.status(200).json({
          message: "update-event-fees-solvathon updated successfully",
        });
      } catch (error) {
        console.log("UPDATE update-event-fees-solvathon error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
