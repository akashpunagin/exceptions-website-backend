const pool = require("../../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../../middleware/exportMiddlewares");
const appConstants = require("../../../../constants/appConstants");
const {
  isEventExistsByEventId,
  getEventByEventId,
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
    "/add-team-member-to-event",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamIdTeamMember, teamIdTeamMemberEvent } =
        appConstants.SQL_TABLE;

      try {
        const { eventId, memberId, teamId } = req.body;

        const isEventExists = await isEventExistsByEventId(eventId);
        if (!isEventExists) {
          return res.status(401).json({ error: "Event does not exists" });
        }

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

        const eventRes = await getEventByEventId(eventId);
        if (eventRes.isError) {
          return res.status(401).json({ error: eventRes.errorMessage });
        }
        const eventData = eventRes.data;
        const eventMaxTeamSize = eventData.eventMaxTeamSize;

        const getEventTeamMembers = await pool.query(
          `SELECT * 
            FROM ${teamIdTeamMemberEvent}, ${teamIdTeamMember}
            WHERE
              ${teamIdTeamMemberEvent}.team_id_team_member_id = ${teamIdTeamMember}.team_id_team_member_id AND
              ${teamIdTeamMember}.team_id = $1 AND
              ${teamIdTeamMemberEvent}.event_id = $2`,
          [teamId, eventId]
        );
        const currentTeamSize = getEventTeamMembers.rowCount;

        if (currentTeamSize >= eventMaxTeamSize) {
          return res
            .status(401)
            .json({ error: "Maximum members are registered for this event" });
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

        const getTeamMemberToEventRes = await pool.query(
          `SELECT * FROM ${teamIdTeamMemberEvent}
          WHERE
            team_id_team_member_id = $1 AND
            event_id = $2`,
          [teamIdTeamMemberId, eventId]
        );
        if (getTeamMemberToEventRes.rowCount > 0) {
          return res
            .status(401)
            .json({ error: "Member is already registered for this event" });
        }

        const addTeamMemberToEventRes = await pool.query(
          `INSERT INTO ${teamIdTeamMemberEvent}(team_id_team_member_id, event_id)
          VALUES($1, $2)
          RETURNING *`,
          [teamIdTeamMemberId, eventId]
        );
        if (addTeamMemberToEventRes.rowCount === 0) {
          return res
            .status(401)
            .json({ error: "Error while adding team member in team" });
        }

        return res.status(200).json({
          status: "Team member added to event successfully",
          data: teamIdTeamMemberData,
        });
      } catch (error) {
        console.log("ADD Team member to event error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
