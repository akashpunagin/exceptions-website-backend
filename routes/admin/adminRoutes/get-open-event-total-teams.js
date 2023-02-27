const pool = require("../../../db/pool");
const appConstants = require("../../../constants/appConstants");
const {
  authorization,
  authorizeAdmin,
} = require("../../../middleware/exportMiddlewares");
const {
  getInfinityAndBeyondEventId,
  getSolvathonEventId,
  getStrikeForceEventId,
} = require("../../../dbUtils/event/dbEventUtils");

module.exports = (router) => {
  router.get(
    "/get-open-event-total-teams",
    [authorization],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamEvents } = appConstants.SQL_TABLE;

      try {
        const infinityAndBeyondEventId = await getInfinityAndBeyondEventId();
        const solvathonEventId = await getSolvathonEventId();
        const strikeForceEventId = await getStrikeForceEventId();

        const getInfinityAndBeyondTeamRes = await pool.query(
          `
        SELECT * 
        FROM ${teamEvents}
        WHERE ${teamEvents}.event_id = $1`,
          [infinityAndBeyondEventId]
        );
        const infinityAndBeyondTeam = getInfinityAndBeyondTeamRes.rows;

        const getSolvathonTeamRes = await pool.query(
          `
        SELECT * 
        FROM ${teamEvents}
        WHERE ${teamEvents}.event_id = $1`,
          [solvathonEventId]
        );
        const solvathonTeam = getSolvathonTeamRes.rows;

        const getStrikeForceTeamRes = await pool.query(
          `
        SELECT * 
        FROM ${teamEvents}
        WHERE ${teamEvents}.event_id = $1`,
          [strikeForceEventId]
        );
        const strikeForceTeam = getStrikeForceTeamRes.rows;

        return res.status(200).json({
          infinityAndBeyond: infinityAndBeyondTeam.length,
          solvathon: solvathonTeam.length,
          strikeForce: strikeForceTeam.length,
        });
      } catch (error) {
        console.log("GET All coordinator error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
