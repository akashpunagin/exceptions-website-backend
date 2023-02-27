const pool = require("../../../db/pool");
const appConstants = require("../../../constants/appConstants");
const { authorization } = require("../../../middleware/exportMiddlewares");

module.exports = (router) => {
  router.get("/get-total-fees", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { participantPayment } = appConstants.SQL_TABLE;

    try {
      const getRes = await pool.query(
        `SELECT SUM(amount) FROM ${participantPayment}`
      );
      let totalFees = getRes.rows[0].sum;
      totalFees = parseInt(totalFees);

      return res.status(200).json(totalFees);
    } catch (error) {
      console.log("GET Total fees error", error);
      return res.status(500).json("Server error");
    }
  });
};
