const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");

module.exports = (router) => {
  router.get("/get-open-events", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { eventMaster } = appConstants.SQL_TABLE;

    try {
      const eventRes = await pool.query(`
        SELECT * FROM ${eventMaster}
        WHERE event_is_open_event = true
      `);
      let data = eventRes.rows;

      data = data.map((event) => {
        return {
          eventId: event.event_id,
          name: event.event_name,
          description: event.event_description,
          maxPoints: event.event_max_points,
          maxTeamSize: event.event_max_team_size,
          isOpenEvent: event.event_is_open_event,
        };
      });

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET Event error", error);
      return res.status(500).json("Server error");
    }
  });
};
