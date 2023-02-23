const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { getUserByUserId } = require("../../../dbUtils/users/dbUsersUtils");
const {
  getTeamIdOfUser,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");
const { getEventsOfTeam } = require("../../../dbUtils/event/dbEventUtils");

module.exports = (router) => {
  router.get("/get-events-of-team", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    try {
      const currentUser = req.user;
      const teamIdRes = await getTeamIdOfUser(currentUser.userId);

      if (teamIdRes.isError) {
        return res.status(401).json({ error: teamIdRes.errorMessage });
      }
      const teamId = teamIdRes.data;

      const data = await getEventsOfTeam(teamId);

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET events of team error", error);
      return res.status(500).json("Server error");
    }
  });
};
