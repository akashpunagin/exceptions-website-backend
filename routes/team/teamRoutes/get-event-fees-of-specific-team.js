const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { getUserByUserId } = require("../../../dbUtils/users/dbUsersUtils");
const {
  getTeamIdOfUser,
  getTeamIsGCConsideredOfUser,
  isTeamExistsByTeamId,
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
  router.post(
    "/get-event-fees-of-specific-team",
    [authorization],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamMaster } = appConstants.SQL_TABLE;

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

        const eventData = await getEventDataOfTeam(teamId);

        const getTeamHeadUserRes = await pool.query(
          `
        SELECT * 
        FROM ${teamMaster}
        WHERE team_id = $1
        `,
          [teamId]
        );
        const teamHeadUserId = getTeamHeadUserRes.rows[0].team_head_user;

        let totalFees = 0;

        const isTeamGCConsideredRes = await getTeamIsGCConsideredOfUser(
          teamHeadUserId
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
    }
  );
};
