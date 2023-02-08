const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { getUserByUserId } = require("../../../dbUtils/users/dbUsersUtils");

module.exports = (router) => {
  router.get("/get", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMaster, teamNames } = appConstants.SQL_TABLE;

    try {
      const teamRes = await pool.query(`
        SELECT *
        FROM ${teamMaster}, ${teamNames}
        WHERE 
          ${teamMaster}.team_name_id = ${teamNames}.id
      `);
      let data = teamRes.rows;

      const asyncTeamRes = await Promise.all(
        data.map(async (row) => {
          const headUserId = row.team_head_user;
          const teamNameId = row.id;
          const teamName = row.label;

          const headUser = await getUserByUserId(headUserId);

          return {
            teamId: row.team_id,
            teamName: {
              label: teamName,
              id: teamNameId,
            },
            headUser,
            isGCConsidered: row.team_is_gc_considered,
            score: row.team_score,
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
