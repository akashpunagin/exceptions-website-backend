const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { isUserExistsByUserId } = require("../../../dbUtils/users/dbUsersUtils");
const {
  isEventExistsByEventId,
} = require("../../../dbUtils/event/dbEventUtils");
const {
  isTeamHeadExists,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");

module.exports = (router) => {
  router.post("/add", [authorization, validateInputs], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMemberEvent, teamMaster } = appConstants.SQL_TABLE;

    try {
      const { eventId, firstName, lastName, usn, email, contactNumber } =
        req.body;

      const currentUser = req.user;

      /*
      const isEventExists = await isEventExistsByEventId(eventId);
      if (!isEventExists) {
        return res.status(401).json({ error: "Event does not exists" });
      }

      const currentTeamRes = await pool.query(
        `SELECT * FROM ${teamMaster}
        WHERE team_head_user = $1`,
        [currentUser.userId]
      );
      if (currentTeamRes.rowCount === 0) {
        return res.status(401).json({ error: "User does not have any team" });
      }
      const currentTeam = currentTeamRes.rows[0];
      const teamId = currentTeam.team_id;

      const teamRes = await pool.query(
        `SELECT team_id
        FROM ${teamMaster}
        WHERE
            team_id = $1 AND
            team_head_user = $2`,
        [teamId, currentUser.userId]
      );
      if (teamRes.rowCount === 0) {
        return res
          .status(401)
          .json({ error: "User does not belong to the current team" });
      }

      const isTeamHeadMemberExists = await isTeamHeadExists(memberUserId);
      if (isTeamHeadMemberExists) {
        return res
          .status(401)
          .json({ error: "Member is already a team head of some other team" });
      }

      const memberRes = await pool.query(
        `SELECT *
        FROM ${teamMemberEvent}
        WHERE member_user_id = $1`,
        [memberUserId]
      );
      if (memberRes.rowCount > 0) {
        return res.status(401).json({
          error: "Member is already a team member of some other team",
        });
      }

      const addRes = await pool.query(
        `INSERT INTO ${teamMemberEvent}(team_id, member_user_id, event_id)
          VALUES($1, $2, $3)
          RETURNING *`,
        [teamId, memberUserId, eventId]
      );
      */

      return res.status(200).json({
        status: "Team member added successfully",
        data: "addRes.rows[0]",
      });
    } catch (error) {
      console.log("ADD Team member error", error);
      return res.status(500).json("Server error");
    }
  });
};
