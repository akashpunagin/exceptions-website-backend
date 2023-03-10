const pool = require("../../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../../middleware/exportMiddlewares");
const appConstants = require("../../../../constants/appConstants");
const {
  isTeamMemberExistsByMemberId,
} = require("../../../../dbUtils/team_member_master/dbTeamMemberMasterUtils");

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

        const isTeamMemberExists = await isTeamMemberExistsByMemberId(memberId);
        if (!isTeamMemberExists) {
          return res.status(401).json({ error: "No such team member exists" });
        }

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
          return res.status(200).json({
            message: "This team member has not been assigned to any team",
          });
        }

        const events = [];

        for (const getTeamData of getTeamRes.rows) {
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
          events.push(data);
        }

        return res.status(200).json(events);
      } catch (error) {
        console.log("GET event of Team member error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
