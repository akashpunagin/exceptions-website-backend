const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { getUserByUserId } = require("../../../dbUtils/users/dbUsersUtils");
const {
  getTeamIdOfUser,
  getMaxTeamMembersOfTeamByTeamId,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");

module.exports = (router) => {
  router.get("/get-max-team-members", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    try {
      const currentUser = req.user;

      const teamIdRes = await getTeamIdOfUser(currentUser.userId);
      if (teamIdRes.isError) {
        return res.status(401).json({ error: teamIdRes.errorMessage });
      }
      const teamId = teamIdRes.data;

      const maxTeamMembers = await getMaxTeamMembersOfTeamByTeamId(teamId);

      return res.status(200).json(maxTeamMembers);
    } catch (error) {
      console.log("GET Max team members error", error);
      return res.status(500).json("Server error");
    }
  });
};
