const pool = require("../../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../../middleware/exportMiddlewares");
const appConstants = require("../../../../constants/appConstants");
const {
  isEventExistsByEventId,
} = require("../../../../dbUtils/event/dbEventUtils");

const {
  getTeamIdOfUser,
  isTeamExistsByTeamId,
} = require("../../../../dbUtils/team_master/dbTeamMasterUtils");
const {
  isTeamMemberExistsByMemberId,
} = require("../../../../dbUtils/team_member_master/dbTeamMemberMasterUtils");

module.exports = (router) => {
  router.post(
    "/remove-team-member-from-event",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamMemberMaster, teamIdTeamMember, teamIdTeamMemberEvent } =
        appConstants.SQL_TABLE;

      try {
        const { memberId, teamId } = req.body;

        const isTeamMemberExists = await isTeamMemberExistsByMemberId(memberId);
        if (!isTeamMemberExists) {
          return res.status(401).json({ error: "Team member does not exists" });
        }

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

        const getTeamIdTeamMemberRes = await pool.query(
          `SELECT * FROM ${teamIdTeamMember}
          WHERE
            team_id = $1 AND
            member_id = $2`,
          [teamId, memberId]
        );
        if (getTeamIdTeamMemberRes.rowCount === 0) {
          return res
            .status(401)
            .json({ error: "No such team member in the team" });
        }
        const teamIdTeamMemberData = getTeamIdTeamMemberRes.rows[0];
        const teamIdTeamMemberId = teamIdTeamMemberData.team_id_team_member_id;

        console.log("SEE HERE:", { teamIdTeamMemberId });

        const deleteTeamMemberFromEventRes = await pool.query(
          `DELETE FROM ${teamIdTeamMemberEvent}
            WHERE team_id_team_member_id = $1
            RETURNING *`,
          [teamIdTeamMemberId]
        );
        if (deleteTeamMemberFromEventRes.rowCount === 0) {
          return res
            .status(401)
            .json({ error: "Member was not assigned to any event" });
        }
        const deleteTeamMemberFromEventData =
          deleteTeamMemberFromEventRes.rows[0];

        return res.status(200).json({
          status: "Team member removed from event successfully",
          data: deleteTeamMemberFromEventData,
        });
      } catch (error) {
        console.log("REMOVE Team member from event error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
