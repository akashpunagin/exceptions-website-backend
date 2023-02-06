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

      const { teamMemberMaster, teamIdTeamMember, teamMaster } =
        appConstants.SQL_TABLE;

      try {
        const teamRes = await pool.query(`SELECT * FROM ${teamMaster}`);
        let data = teamRes.rows;

        const asyncTeamRes = await Promise.all(
          data.map(async (team) => {
            const headUserId = team.team_head_user;
            const teamId = team.team_id;
            const headUser = await getUserByUserId(headUserId);
            const teamMembers = await getTeamMembersByTeamId(teamId);

            return {
              teamId: teamId,
              name: team.team_name,
              headUser,
              isGCConsidered: team.team_is_gc_considered,
              score: team.team_score,
              teamMembers,
            };
          })
        );

        return res.status(200).json(asyncTeamRes);
      } catch (error) {
        console.log("GET Team member by event id error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
