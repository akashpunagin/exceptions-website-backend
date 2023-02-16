const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { getUserByUserId } = require("../../../dbUtils/users/dbUsersUtils");
const {
  getTeamIdOfUser,
  getTeamIsGCConsideredOfUser,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");

module.exports = (router) => {
  router.get("/get-event-fees-of-team", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMaster, teamEvents, eventMaster } = appConstants.SQL_TABLE;

    try {
      const currentUser = req.user;
      const teamIdRes = await getTeamIdOfUser(currentUser.userId);

      if (teamIdRes.isError) {
        return res.status(401).json({ error: teamIdRes.errorMessage });
      }
      const teamId = teamIdRes.data;

      const teamRes = await pool.query(
        `SELECT ${eventMaster}.*
        FROM ${teamMaster}, ${teamEvents}, ${eventMaster}
        WHERE 
          ${teamMaster}.team_id = ${teamEvents}.team_id AND
          ${teamEvents}.event_id = ${eventMaster}.event_id AND
          ${teamEvents}.team_id = $1`,
        [teamId]
      );
      let data = teamRes.rows;

      data = data.map((row) => {
        return {
          eventId: row.event_id,
          eventName: row.event_name,
          eventDescription: row.event_description,
          eventMaxPoints: row.event_max_points,
          eventMaxTeamSize: row.event_max_team_size,
          eventIsOpenEvent: row.event_is_open_event,
        };
      });

      //
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
      }

      return res.status(200).json(isTeamGCConsidered);
    } catch (error) {
      console.log("GET events of team error", error);
      return res.status(500).json("Server error");
    }
  });
};
