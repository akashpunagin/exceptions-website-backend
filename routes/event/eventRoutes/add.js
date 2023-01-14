const pool = require("../../../db/pool");
const {
  authorization,
  authorizeAdmin,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");

module.exports = (router) => {
  router.post(
    "/add",
    [authorization, authorizeAdmin, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { eventMaster } = appConstants.SQL_TABLE;

      try {
        const { name, description, maxPoints, maxTeamSize } = req.body;

        const eventRes = await pool.query(
          `SELECT event_id 
            FROM ${eventMaster}
            WHERE event_name = $1`,
          [name]
        );
        if (eventRes.rowCount > 0) {
          return res.status(401).json({ error: "Event already exists" });
        }

        const addRes = await pool.query(
          `INSERT INTO ${eventMaster}(event_name, event_description, 
            event_max_points, event_max_team_size)
          VALUES($1, $2, $3, $4)
          RETURNING *`,
          [name, description, maxPoints, maxTeamSize]
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
