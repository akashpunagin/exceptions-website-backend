const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { getUserByUserId } = require("../../../dbUtils/users/dbUsersUtils");

module.exports = (router) => {
  router.get("/get-events-of-team", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMaster, teamEvents, eventMaster } = appConstants.SQL_TABLE;

    try {
      const teamRes = await pool.query(`
        SELECT ${eventMaster}.*
        FROM ${teamMaster}, ${teamEvents}, ${eventMaster}
        WHERE 
          ${teamMaster}.team_id = ${teamEvents}.team_id AND
          ${teamEvents}.event_id = ${eventMaster}.event_id
      `);
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

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET events of team error", error);
      return res.status(500).json("Server error");
    }
  });
};
