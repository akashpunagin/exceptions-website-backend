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
const { isParticipantPaid } = require("../../../dbUtils/users/dbUsersUtils");

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
        let strikeForcePaidTeams = 0;
        for (const team of strikeForceTeams) {
          if (await isParticipantPaid(team.headUser.userId)) {
            strikeForcePaidTeams += 1;
          }
        }

        const solvathonTeams = await getTeamsInEvent(solvathonEventId);
        let solvathonPaidTeams = 0;
        for (const team of solvathonTeams) {
          if (await isParticipantPaid(team.headUser.userId)) {
            solvathonPaidTeams += 1;
          }
        }

        const infinityAndBeyondTeams = await getTeamsInEvent(
          infinityAndBeyondEventId
        );
        let infinityAndBeyondPaidTeams = 0;
        for (const team of infinityAndBeyondTeams) {
          if (await isParticipantPaid(team.headUser.userId)) {
            infinityAndBeyondPaidTeams += 1;
          }
        }

        return res.status(200).json({
          strikeForce: strikeForceTeams.length,
          solvathon: solvathonTeams.length,
          infinityAndBeyond: infinityAndBeyondTeams.length,
          strikeForcePaidTeams,
          solvathonPaidTeams,
          infinityAndBeyondPaidTeams,
        });
      } catch (error) {
        console.log("GET All coordinator error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
