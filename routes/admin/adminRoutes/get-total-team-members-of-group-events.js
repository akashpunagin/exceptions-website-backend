const appConstants = require("../../../constants/appConstants");
const { authorization } = require("../../../middleware/exportMiddlewares");
const {
  getOnlyGroupEventsTeams,
} = require("../../../dbUtils/event/dbEventUtils");
const {
  getTeamMembersByTeamId,
} = require("../../../dbUtils/team_member_master/dbTeamMemberMasterUtils");

module.exports = (router) => {
  router.get(
    "/get-total-team-members-of-group-events",
    [authorization],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      try {
        const teamIds = await getOnlyGroupEventsTeams();

        let totalTeamMembers = 0;
        for (const teamId of teamIds) {
          const numberOfTeamMembers = await getTeamMembersByTeamId(teamId);
          totalTeamMembers += numberOfTeamMembers.length;
        }

        return res.status(200).json(totalTeamMembers);
      } catch (error) {
        console.log("GET All coordinator error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
