const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  getTeamMembersByEventId,
  isEventExistsByEventId,
} = require("../../../dbUtils/event/dbEventUtils");
const { groupBy } = require("../../../utilities/groupBy");
const {
  getTeamByTeamId,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");

module.exports = (router) => {
  router.post(
    "/get-team-members-by-event-id",
    [authorization],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { eventMaster } = appConstants.SQL_TABLE;

      try {
        const { eventId } = req.body;

        const isEventExists = await isEventExistsByEventId(eventId);
        if (!isEventExists) {
          return res.status(401).json({ error: "Event does not exists" });
        }

        const eventTeamMembers = await getTeamMembersByEventId(eventId);
        const eventTeamMembersGroupByTeamId = groupBy(
          eventTeamMembers,
          "teamId"
        );

        const data = [];

        for (const teamId in eventTeamMembersGroupByTeamId) {
          if (
            Object.prototype.hasOwnProperty.call(
              eventTeamMembersGroupByTeamId,
              teamId
            )
          ) {
            const res = await getTeamByTeamId(teamId);
            const teamData = res.data;

            teamData.members = eventTeamMembersGroupByTeamId[teamId];

            data.push(teamData);
          }
        }

        return res.status(200).json(data);
      } catch (error) {
        console.log("GET team members by Event id error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
