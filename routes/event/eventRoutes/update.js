const pool = require("../../../db/pool");
const {
  authorization,
  authorizeAdmin,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  isEventExistsByEventId,
} = require("../../../dbUtils/event/dbEventUtils");

module.exports = (router) => {
  router.post(
    "/update",
    [authorization, authorizeAdmin, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { eventMaster } = appConstants.SQL_TABLE;

      try {
        const {
          eventId,
          name,
          description,
          maxPoints,
          maxTeamSize,
          isOpenEvent,
        } = req.body;

        const isEventExists = await isEventExistsByEventId(eventId);
        if (!isEventExists) {
          return res.status(401).json({ error: "Event does not exists" });
        }

        const updateRes = await pool.query(
          `UPDATE ${eventMaster}
          SET 
            event_name = $1,
            event_description = $2,
            event_max_points = $3,
            event_max_team_size = $4,
            event_is_open_event = $5
          WHERE event_id = $6
          RETURNING *`,
          [name, description, maxPoints, maxTeamSize, isOpenEvent, eventId]
        );

        return res.status(200).json({
          status: "Event updated successfully",
          data: updateRes.rows[0],
        });
      } catch (error) {
        console.log("Update Event error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
