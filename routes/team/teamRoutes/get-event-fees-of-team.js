const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { getUserByUserId } = require("../../../dbUtils/users/dbUsersUtils");
const {
  getTeamIdOfUser,
  getTeamIsGCConsideredOfUser,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");
const {
  getAllGroupEventsFees,
  getStrikeForceFees,
  getSolvathonEventFees,
  getInfinityAndBeyondEventFees,
} = require("../../../dbUtils/app_int_constants/dbAppIntConstantsUtils");
const {
  getStrikeForceEventName,
  getSolvathonEventName,
  getInfinityAndBeyondEventName,
} = require("../../../dbUtils/event/dbEventUtils");

async function getEventDataOfTeam(teamId) {
  const { teamMaster, teamEvents, eventMaster } = appConstants.SQL_TABLE;

  const teamRes = await pool.query(
    `SELECT ${eventMaster}.*
    FROM ${teamMaster}, ${teamEvents}, ${eventMaster}
    WHERE 
      ${teamMaster}.team_id = ${teamEvents}.team_id AND
      ${teamEvents}.event_id = ${eventMaster}.event_id AND
      ${teamEvents}.team_id = $1`,
    [teamId]
  );
  let eventData = teamRes.rows;

  eventData = eventData.map((row) => {
    return {
      eventId: row.event_id,
      eventName: row.event_name,
      eventDescription: row.event_description,
      eventMaxPoints: row.event_max_points,
      eventMaxTeamSize: row.event_max_team_size,
      eventIsOpenEvent: row.event_is_open_event,
    };
  });

  return eventData;
}

module.exports = (router) => {
  router.get("/get-event-fees-of-team", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    try {
      const currentUser = req.user;
      const teamIdRes = await getTeamIdOfUser(currentUser.userId);
      if (teamIdRes.isError) {
        return res.status(401).json({ error: teamIdRes.errorMessage });
      }
      const teamId = teamIdRes.data;

      const eventData = await getEventDataOfTeam(teamId);

      let totalFees = 0;

      const isTeamGCConsideredRes = await getTeamIsGCConsideredOfUser(
        currentUser.userId
      );
      if (isTeamGCConsideredRes.isError) {
        return res
          .status(401)
          .json({ error: isTeamGCConsideredRes.errorMessage });
      }
      const isTeamGCConsidered = isTeamGCConsideredRes.data;
      if (isTeamGCConsidered) {
        const allGroupEventFees = await getAllGroupEventsFees();
        totalFees += allGroupEventFees;
      }

      const isStrikeForcePresent = eventData.some((event) => {
        const eventName = event.eventName;
        return eventName === getStrikeForceEventName();
      });
      if (isStrikeForcePresent) {
        const fees = await getStrikeForceFees();
        totalFees += fees;
      }

      const isSolvathonPresent = eventData.some((event) => {
        const eventName = event.eventName;
        return eventName === getSolvathonEventName();
      });
      if (isSolvathonPresent) {
        const fees = await getSolvathonEventFees();
        totalFees += fees;
      }

      const isInfinityAndBeyondPresent = eventData.some((event) => {
        const eventName = event.eventName;
        return eventName === getInfinityAndBeyondEventName();
      });
      if (isInfinityAndBeyondPresent) {
        const fees = await getInfinityAndBeyondEventFees();
        totalFees += fees;
      }

      return res.status(200).json({ totalFees });
    } catch (error) {
      console.log("GET events of team error", error);
      return res.status(500).json("Server error");
    }
  });
};
