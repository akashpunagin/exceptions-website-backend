const pool = require("../../../db/pool");
const {
  authorization,
  authorizeAdmin,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");

module.exports = (router) => {
  router.get("/get-team-of-current-user", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMaster } = appConstants.SQL_TABLE;

    try {
      const currentUser = req.user;

      const teamRes = await pool.query(
        `SELECT * FROM ${teamMaster}
        WHERE team_head_user = $1`,
        [currentUser.userId]
      );

      let data = [];
      if (teamRes.rowCount > 0) {
        const team = teamRes.rows[0];

        data = {
          teamId: team.team_id,
          name: team.team_name,
          headUserId: team.team_head_user,
          isGCConsidered: team.team_is_gc_considered,
          score: team.team_score,
        };
      }

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET Team of current user error", error);
      return res.status(500).json("Server error");
    }
  });
};
