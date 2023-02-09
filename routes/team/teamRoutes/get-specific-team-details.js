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
  router.post(
    "/get-specific-team-details",
    [authorization],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamMaster, teamNames } = appConstants.SQL_TABLE;

      try {
        const { teamId } = req.body;

        const isTeamExistsByTeamIdRes = await isTeamExistsByTeamId(teamId);
        if (isTeamExistsByTeamIdRes.isError) {
          return res
            .status(401)
            .json({ error: isTeamExistsByTeamIdRes.errorMessage });
        }
        const isTeamExists = isTeamExistsByTeamIdRes.data;
        if (!isTeamExists) {
          return res.status(401).json({ error: "Team does not exists" });
        }

        const teamRes = await pool.query(
          `SELECT *
            FROM ${teamMaster}, ${teamNames}
            WHERE 
              ${teamMaster}.team_name_id = ${teamNames}.id AND
              ${teamMaster}.team_id = $1`,
          [teamId]
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
    }
  );
};
