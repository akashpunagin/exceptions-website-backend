const pool = require("../../../db/pool");
const appConstants = require("../../../constants/appConstants");
const {
  authorization,
  authorizeAdmin,
} = require("../../../middleware/exportMiddlewares");

module.exports = (router) => {
  router.get("/get-total-team-members", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMemberMaster } = appConstants.SQL_TABLE;

    try {
      const getRes = await pool.query(
        `SELECT COUNT(*) FROM ${teamMemberMaster}`
      );
      let totalTeamMembers = getRes.rows[0].count;
      totalTeamMembers = parseInt(totalTeamMembers);

      return res.status(200).json(totalTeamMembers);
    } catch (error) {
      console.log("GET All volunteers error", error);
      return res.status(500).json("Server error");
    }
  });
};
