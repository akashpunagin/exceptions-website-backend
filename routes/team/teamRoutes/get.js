const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { getUserByUserId } = require("../../../dbUtils/users/dbUsersUtils");

module.exports = (router) => {
  router.get("/get", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMaster } = appConstants.SQL_TABLE;

    try {
      const teamRes = await pool.query(`SELECT * FROM ${teamMaster}`);
      let data = teamRes.rows;

      const asyncTeamRes = await Promise.all(
        data.map(async (team) => {
          const headUserId = team.team_head_user;
          const headUser = await getUserByUserId(headUserId);

          return {
            teamId: team.team_id,
            name: team.team_name,
            headUser,
            isGCConsidered: team.team_is_gc_considered,
            score: team.team_score,
          };
        })
      );

      return res.status(200).json(asyncTeamRes);
    } catch (error) {
      console.log("GET Team error", error);
      return res.status(500).json("Server error");
    }
  });
};
