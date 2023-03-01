const pool = require("../../../db/pool");
const appConstants = require("../../../constants/appConstants");
const {
  authorization,
  authorizeAdmin,
} = require("../../../middleware/exportMiddlewares");
const {
  getOnlyGroupEventsTeams,
} = require("../../../dbUtils/event/dbEventUtils");

module.exports = (router) => {
  router.get(
    "/get-group-event-total-teams",
    [authorization],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamEvents } = appConstants.SQL_TABLE;

      try {
        const teamIds = await getOnlyGroupEventsTeams();

        return res.status(200).json(teamIds.length);
      } catch (error) {
        console.log("GET All coordinator error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
