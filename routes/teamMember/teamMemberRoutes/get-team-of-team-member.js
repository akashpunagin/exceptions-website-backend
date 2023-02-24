const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  getTeamIdOfUser,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");

module.exports = (router) => {
  router.post(
    "/get-team-of-team-member",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamMemberMaster, teamIdTeamMember, teamMaster } =
        appConstants.SQL_TABLE;

      try {
        const { memberId } = req.body;

        const currentUser = req.user;

        const getTeamOfUserRes = await getTeamIdOfUser(currentUser.userId);
        if (getTeamOfUserRes.isError) {
          return res.status(401).json({ error: getTeamOfUserRes.errorMessage });
        }
        const teamId = getTeamOfUserRes.data;

        const teamRes = await pool.query(
          `SELECT teamMaster.*
        FROM
          ${teamMemberMaster} as master,
          ${teamIdTeamMember} as member,
          ${teamMaster} as teamMaster
        WHERE
          member.member_id = master.member_id AND
          member.team_id = teamMaster.team_id AND
          member.team_id = $1 AND
          member.member_id = $2`,
          [teamId, memberId]
        );

        if (teamRes.rowCount === 0) {
          return res
            .status(401)
            .json({ error: "Team member does not have any team" });
        }
        const data = teamRes.rows[0];

        const teamDetails = {
          teamId: data.team_id,
          teamNameId: data.team_name_id,
          teamHeadUser: data.team_head_user,
          teamIsGcConsidered: data.team_is_gc_considered,
          teamScore: data.team_score,
        };

        return res.status(200).json(teamDetails);
      } catch (error) {
        console.log("GET Team by team member id error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
