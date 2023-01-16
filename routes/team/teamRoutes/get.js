const pool = require("../../../db/pool");
const {
  authorization,
  authorizeAdmin,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");

module.exports = (router) => {
  router.get("/get", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMaster } = appConstants.SQL_TABLE;

    try {
      const teamRes = await pool.query(`SELECT * FROM ${teamMaster}`);
      let data = teamRes.rows;

      data = data.map((team) => {
        return {
          teamId: team.team_id,
          name: team.team_name,
          headUserId: team.team_head_user,
          isGCConsidered: team.team_is_gc_considered,
        };
      });

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET Team error", error);
      return res.status(500).json("Server error");
    }
  });
};
