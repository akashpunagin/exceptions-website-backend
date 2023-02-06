const pool = require("../../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../../middleware/exportMiddlewares");
const appConstants = require("../../../../constants/appConstants");
const {
  getTeamIdOfUser,
} = require("../../../../dbUtils/team_master/dbTeamMasterUtils");
const {
  isEventExistsByEventId,
} = require("../../../../dbUtils/event/dbEventUtils");

module.exports = (router) => {
  router.post(
    "/get-event-of-team-member",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamIdTeamMemberEvent, teamIdTeamMember, eventMaster } =
        appConstants.SQL_TABLE;

      try {
        const { memberId } = req.body;

        const getTeamRes = await pool.query(
          `SELECT * 
          FROM ${teamIdTeamMember}, ${teamIdTeamMemberEvent}, ${eventMaster}
          WHERE 
            ${teamIdTeamMember}.team_id_team_member_id = ${teamIdTeamMemberEvent}.team_id_team_member_id AND
            ${teamIdTeamMemberEvent}.event_id = ${eventMaster}.event_id AND
            ${teamIdTeamMember}.member_id = $1
        `,
          [memberId]
        );

        if (getTeamRes.rowCount === 0) {
          return res.status(200).json({});
        }

        const getTeamData = getTeamRes.rows[0];

        const {
          team_id,
          event_id,
          event_name,
          event_description,
          event_max_points,
          event_max_team_size,
          event_is_open_event,
        } = getTeamData;

        const data = {
          teamId: team_id,
          eventId: event_id,
          eventName: event_name,
          eventDescription: event_description,
          eventMaxPoints: event_max_points,
          eventMaxTeamSize: event_max_team_size,
          eventIsOpenEvent: event_is_open_event,
        };

        return res.status(200).json(data);
      } catch (error) {
        console.log("GET event of Team member error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
