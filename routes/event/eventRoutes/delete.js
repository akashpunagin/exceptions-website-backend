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
  router.delete(
    "/delete",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { eventMaster } = appConstants.SQL_TABLE;

      try {
        const { eventId } = req.body;

        const isEventExists = await isEventExistsByEventId(eventId);
        if (!isEventExists) {
          return res.status(401).json({ error: "Event does not exists" });
        }

        const delRes = await pool.query(
          `DELETE FROM ${eventMaster}
          WHERE event_id = $1
          RETURNING *`,
          [eventId]
        );

        return res.status(200).json({
          status: "Event deleted successfully",
          data: delRes.rows[0],
        });
      } catch (error) {
        console.log("DELETE Event error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
