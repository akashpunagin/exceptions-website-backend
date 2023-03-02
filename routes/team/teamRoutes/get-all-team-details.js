const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { getUserByUserId } = require("../../../dbUtils/users/dbUsersUtils");
const {
  getTeamMembersByTeamId,
} = require("../../../dbUtils/team_member_master/dbTeamMemberMasterUtils");
const {
  isTeamExistsByTeamId,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");

module.exports = (router) => {
  router.get("/get-all-team-details", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMaster, teamNames } = appConstants.SQL_TABLE;

    try {
      const teamRes = await pool.query(
        `SELECT *
            FROM ${teamMaster}, ${teamNames}
            WHERE ${teamMaster}.team_name_id = ${teamNames}.id`
      );
      const data = teamRes.rows;

      const asyncTeamRes = await Promise.all(
        data.map(async (row) => {
          const {
            team_head_user: headUserId,
            id: teamNameId,
            label: teamName,
            team_id: teamId,
          } = row;

          const headUser = await getUserByUserId(headUserId);

          const teamMembers = await getTeamMembersByTeamId(teamId);

          return {
            teamId,
            teamName: {
              label: teamName,
              id: teamNameId,
            },
            headUser,
            isGCConsidered: row.team_is_gc_considered,
            score: row.team_score,
            teamMembers,
          };
        })
      );

      return res.status(200).json(asyncTeamRes);
    } catch (error) {
      console.log("GET specific team details error", error);
      return res.status(500).json("Server error");
    }
  });
};
