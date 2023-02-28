const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  isEventExistsByEventId,
} = require("../../../dbUtils/event/dbEventUtils");

module.exports = (router) => {
  router.post(
    "/get-teams-of-event",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamMaster, teamEvents, teamNames } = appConstants.SQL_TABLE;

      try {
        const { eventId } = req.body;
        const isEventExists = await isEventExistsByEventId(eventId);
        if (!isEventExists) {
          return res.status(401).json({ error: "Event does not exists" });
        }

        const getRes = await pool.query(
          `SELECT * 
        FROM ${teamMaster}, ${teamEvents}, ${teamNames}
        WHERE
            ${teamEvents}.team_id = ${teamMaster}.team_id AND
            ${teamMaster}.team_name_id = ${teamNames}.id AND
            ${teamEvents}.event_id = $1`,
          [eventId]
        );

        let data = getRes.rows;
        data = data.map((row) => {
          const teamName = { id: row.id, label: row.label };

          return {
            teamId: row.team_id,
            team_head_user: row.team_head_user,
            teamIsGCConsidered: row.team_is_gc_considered,
            teamScore: row.team_score,
            teamName,
          };
        });

        return res.status(200).json(data);
      } catch (error) {
        console.log("GET Teams of event error:", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
