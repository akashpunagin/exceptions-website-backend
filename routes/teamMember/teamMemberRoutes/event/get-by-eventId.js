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
    "/get-by-eventId",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamIdTeamMemberEvent, teamMemberMaster, teamMaster } =
        appConstants.SQL_TABLE;

      try {
        const { eventId } = req.body;

        const currentUser = req.user;

        const isEventExists = await isEventExistsByEventId(eventId);
        if (!isEventExists) {
          return res.status(401).json({ error: "Event does not exists" });
        }

        const getTeamOfUserRes = await getTeamIdOfUser(currentUser.userId);
        if (getTeamOfUserRes.isError) {
          return res.status(401).json({ error: getTeamOfUserRes.errorMessage });
        }
        const teamId = getTeamOfUserRes.data;

        const teamRes = await pool.query(
          `SELECT * FROM ${teamMemberEvent}
        WHERE
          team_id = $1 AND
          event_id = $2`,
          [teamId, eventId]
        );
        const data = teamRes.rows.map((row) => {
          return {
            teamId: row.team_id,
            eventId: row.event_id,
            firstName: row.first_name,
            lastName: row.last_name,
            usn: row.usn,
            email: row.email,
            contactNumber: row.contact_number,
          };
        });

        return res.status(200).json(data);
      } catch (error) {
        console.log("GET Team member by event iderror", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
