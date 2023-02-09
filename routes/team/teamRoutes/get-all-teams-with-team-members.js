const pool = require("../../../db/pool");
const {
  authorization,
  authorizeAdmin,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  getTeamIdOfUser,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");
const { getUserByUserId } = require("../../../dbUtils/users/dbUsersUtils");
const {
  getTeamMembersByTeamId,
} = require("../../../dbUtils/team_member_master/dbTeamMemberMasterUtils");

module.exports = (router) => {
  router.get(
    "/get-all-teams-with-team-members",
    [authorization],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamMemberMaster, teamIdTeamMember, teamMaster, teamNames } =
        appConstants.SQL_TABLE;

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

            const teamId = row.team_id;
            const teamMembers = await getTeamMembersByTeamId(teamId);

            return {
              teamId: row.team_id,
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
        console.log("GET all teams with team members error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
