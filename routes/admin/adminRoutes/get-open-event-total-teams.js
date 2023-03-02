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
const {
  getTeamsInEvent,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");

module.exports = (router) => {
  router.get(
    "/get-open-event-total-teams",
    [authorization],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      try {
        const infinityAndBeyondEventId = await getInfinityAndBeyondEventId();
        const solvathonEventId = await getSolvathonEventId();
        const strikeForceEventId = await getStrikeForceEventId();

        const strikeForceTeams = await getTeamsInEvent(strikeForceEventId);
        const solvathonTeams = await getTeamsInEvent(solvathonEventId);
        const infinityAndBeyondteams = await getTeamsInEvent(
          infinityAndBeyondEventId
        );

        return res.status(200).json({
          strikeForce: strikeForceTeams.length,
          solvathon: solvathonTeams.length,
          infinityAndBeyond: infinityAndBeyondteams.length,
        });
      } catch (error) {
        console.log("GET All coordinator error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
