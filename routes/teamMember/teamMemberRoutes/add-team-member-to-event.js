const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  isEventExistsByEventId,
} = require("../../../dbUtils/event/dbEventUtils");

const {
  getTeamIdOfUser,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");
const {
  isTeamMemberExistsByMemberId,
} = require("../../../dbUtils/team_member_master/dbTeamMemberMasterUtils");

module.exports = (router) => {
  router.post(
    "/add-team-member-to-event",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamMemberMaster, teamIdTeamMember, teamIdTeamMemberEvent } =
        appConstants.SQL_TABLE;

      try {
        const { eventId, memberId } = req.body;

        const currentUser = req.user;

        const isEventExists = await isEventExistsByEventId(eventId);
        if (!isEventExists) {
          return res.status(401).json({ error: "Event does not exists" });
        }

        const isTeamMemberExists = await isTeamMemberExistsByMemberId(memberId);
        if (!isTeamMemberExists) {
          return res.status(401).json({ error: "Team member does not exists" });
        }

        const getTeamOfUserRes = await getTeamIdOfUser(currentUser.userId);
        if (getTeamOfUserRes.isError) {
          return res.status(401).json({ error: getTeamOfUserRes.errorMessage });
        }
        const teamId = getTeamOfUserRes.data;

        const getTeamMemberToEventRes = await pool.query(
          `SELECT * FROM ${teamIdTeamMemberEvent}
          WHERE
            team_id = $1 AND
            member_id = $2 AND
            event_id = $3`,
          [teamId, memberId, eventId]
        );
        if (getTeamMemberToEventRes.rowCount > 0) {
          return res
            .status(401)
            .json({ error: "Member is already registered for this event" });
        }

        const getTeamMemberExistsRes = await pool.query(
          `SELECT * FROM ${teamIdTeamMemberEvent}
          WHERE
            team_id = $1 AND
            member_id = $2`,
          [teamId, memberId]
        );
        if (getTeamMemberExistsRes.rowCount > 0) {
          return res
            .status(401)
            .json({ error: "Member is already exists in other event" });
        }

        const addTeamMemberToEventRes = await pool.query(
          `INSERT INTO ${teamIdTeamMemberEvent}(team_id, member_id, event_id)
          VALUES($1, $2, $3)
          RETURNING *`,
          [teamId, memberId, eventId]
        );
        if (addTeamMemberToEventRes.rowCount === 0) {
          return res
            .status(401)
            .json({ error: "Error while adding team member in team" });
        }
        const teamIdTeamMemberData = addTeamMemberToEventRes.rows[0];

        return res.status(200).json({
          status: "Team member added to event successfully",
          data: { ...teamIdTeamMemberData },
        });
      } catch (error) {
        console.log("ADD Team member error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
