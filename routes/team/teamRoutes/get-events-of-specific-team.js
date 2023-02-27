const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { getUserByUserId } = require("../../../dbUtils/users/dbUsersUtils");
const {
  getTeamIdOfUser,
  isTeamExistsByTeamId,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");
const { getEventsOfTeam } = require("../../../dbUtils/event/dbEventUtils");

module.exports = (router) => {
  router.post(
    "/get-events-of-specific-team",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      try {
        const { teamId } = req.body;
        const isTeamExistsByTeamIdRes = await isTeamExistsByTeamId(teamId);
        if (isTeamExistsByTeamIdRes.isError) {
          return res
            .status(401)
            .json({ error: isTeamExistsByTeamIdRes.errorMessage });
        }
        const isTeamExists = isTeamExistsByTeamIdRes.data;
        if (!isTeamExists) {
          return res.status(401).json({ error: "Team does not exists" });
        }

        const data = await getEventsOfTeam(teamId);

        return res.status(200).json(data);
      } catch (error) {
        console.log("GET events of team error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
