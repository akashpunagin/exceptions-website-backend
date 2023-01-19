const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  isEventExistsByEventId,
} = require("../../../dbUtils/event/dbEventUtils");

const {
  getTeamIdOfUser,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");
const {
  isTeamMemberExistsByMemberId,
} = require("../../../dbUtils/team_member_master/dbTeamMemberMasterUtils");

module.exports = (router) => {
  router.post(
    "/add-team-member-to-event",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamMemberMaster, teamIdTeamMember, teamIdTeamMemberEvent } =
        appConstants.SQL_TABLE;

      try {
        const { eventId, memberId } = req.body;

        const currentUser = req.user;

        const isEventExists = await isEventExistsByEventId(eventId);
        if (!isEventExists) {
          return res.status(401).json({ error: "Event does not exists" });
        }

        const isTeamMemberExists = await isTeamMemberExistsByMemberId(memberId);
        if (!isTeamMemberExists) {
          return res.status(401).json({ error: "Team member does not exists" });
        }

        const getTeamOfUserRes = await getTeamIdOfUser(currentUser.userId);
        if (getTeamOfUserRes.isError) {
          return res.status(401).json({ error: getTeamOfUserRes.errorMessage });
        }
        const teamId = getTeamOfUserRes.data;

        console.log("SEE here:", teamId);

        const addTeamMemberToEventRes = await pool.query(
          `INSERT INTO ${teamIdTeamMemberEvent}(team_id, member_id, event_id)
          VALUES($1, $2, $3)
          RETURNING *`,
          [teamId, memberId, eventId]
        );
        if (addTeamMemberToEventRes.rowCount === 0) {
          return res
            .status(401)
            .json({ error: "Error while adding team member in team" });
        }
        const teamIdTeamMemberData = addTeamMemberToEventRes.rows[0];

        return res.status(200).json({
          status: "Team member added to event successfully",
          data: { ...teamIdTeamMemberData, teamId },
        });
      } catch (error) {
        console.log("ADD Team member error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
