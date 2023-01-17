const pool = require("../../../db/pool");
const {
  authorization,
  authorizeAdmin,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  isEventExistsByEventName,
} = require("../../../dbUtils/event/dbEventUtils");

module.exports = (router) => {
  router.post(
    "/add",
    [authorization, authorizeAdmin, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { eventMaster } = appConstants.SQL_TABLE;

      try {
        const { name, description, maxPoints, maxTeamSize, isOpenEvent } =
          req.body;

        const isEventExists = await isEventExistsByEventName(name);
        if (isEventExists) {
          return res.status(401).json({ error: "Event already exists" });
        }

        const addRes = await pool.query(
          `INSERT INTO ${eventMaster}(event_name, event_description, 
            event_max_points, event_max_team_size, event_is_open_event)
          VALUES($1, $2, $3, $4, $5)
          RETURNING *`,
          [name, description, maxPoints, maxTeamSize, isOpenEvent]
        );

        return res.status(200).json({
          status: "Event added successfully",
          data: addRes.rows[0],
        });
      } catch (error) {
        console.log("ADD Event error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
