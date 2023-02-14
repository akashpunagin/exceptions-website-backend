const pool = require("../../../db/pool");
const {
  authorization,
  authorizeParticipant,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { isUserExistsByUserId } = require("../../../dbUtils/users/dbUsersUtils");
const {
  isTeamHeadExists,
  isTeamExistsByTeamNameId,
  getTeamIdOfUser,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");
const {
  isTeamNameExistsById,
} = require("../../../dbUtils/team_names/dbTeamNamesUtils");
const {
  isOpenEventExistsByEventId,
  getGroupEvents,
} = require("../../../dbUtils/event/dbEventUtils");

module.exports = (router) => {
  router.post(
    "/add",
    [authorization, authorizeParticipant, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamMaster, teamEvents } = appConstants.SQL_TABLE;

      try {
        const { teamNameId, isGCConsidered, openEventIds } = req.body;

        const currentUser = req.user;
        const headUserId = currentUser.userId;

        const isTeamNameExists = await isTeamNameExistsById(teamNameId);
        if (!isTeamNameExists) {
          return res.status(401).json({ error: "Team name does not exists" });
        }

        const isTeamExistsByTeamIdRes = await isTeamExistsByTeamNameId(
          teamNameId
        );
        if (isTeamExistsByTeamIdRes.isError) {
          return res
            .status(401)
            .json({ error: isTeamExistsByTeamIdRes.errorMessage });
        }
        const isTeamExistsByTeamName = isTeamExistsByTeamIdRes.data;
        if (isTeamExistsByTeamName) {
          return res
            .status(401)
            .json({ error: "Team with name already exists" });
        }

        const isTeamHeadUserExists = await isTeamHeadExists(headUserId);
        if (isTeamHeadUserExists) {
          return res
            .status(401)
            .json({ error: "User is already a team head of another team" });
        }

        for (let i = 0; i < openEventIds.length; i++) {
          const openEventId = openEventIds[i];
          const isOpenEventExists = await isOpenEventExistsByEventId(
            openEventId
          );

          if (!isOpenEventExists) {
            return res.status(401).json({
              error: `Id-${openEventId} is not a valid open event id`,
            });
          }
        }

        const addRes = await pool.query(
          `INSERT INTO ${teamMaster}(team_name_id, team_head_user, team_is_gc_considered)
            VALUES($1, $2, $3)
            RETURNING *`,
          [teamNameId, headUserId, isGCConsidered]
        );
        const data = addRes.rows[0];
        const teamId = data.team_id;

        for (let i = 0; i < openEventIds.length; i++) {
          const openEventId = openEventIds[i];
          await pool.query(
            `INSERT INTO ${teamEvents}(team_id, event_id)
              VALUES($1, $2)
              RETURNING *`,
            [teamId, openEventId]
          );
        }

        if (isGCConsidered) {
          const groupEvents = await getGroupEvents();
          const groupEventIds = groupEvents.map((event) => event.eventId);

          for (let i = 0; i < groupEventIds.length; i++) {
            const groupEventId = groupEventIds[i];
            await pool.query(
              `INSERT INTO ${teamEvents}(team_id, event_id)
                VALUES($1, $2)
                RETURNING *`,
              [teamId, groupEventId]
            );
          }
        }

        return res.status(200).json({
          status: "Team added successfully",
          data: addRes.rows[0],
        });
      } catch (error) {
        console.log("ADD Team error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
