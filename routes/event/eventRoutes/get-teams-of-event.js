const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");

module.exports = (router) => {
  router.get("/get-long", [authorization, validateInputs], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMaster, teamEvents } = appConstants.SQL_TABLE;

    try {
      const delRes = await pool.query(`
      SELECT * 
      FROM ${teamMaster}, ${teamEvents}
      WHERE
        ${teamEvents}
      `);

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET Teams of event error:", error);
      return res.status(500).json("Server error");
    }
  });
};
