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
  router.post("/delete", [authorization, validateInputs], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMemberEvent, teamMaster } = appConstants.SQL_TABLE;

    try {
      const { eventId, firstName, lastName, usn, email, contactNumber } =
        req.body;

      const currentUser = req.user;

      //   const isEventExists = await isEventExistsByEventId(eventId);
      //   if (!isEventExists) {
      //     return res.status(401).json({ error: "Event does not exists" });
      //   }

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

      const teamMemberDeleteRes = await pool.query(
        `DELETE FROM ${teamMemberEvent}
          WHERE 
            team_id = $1 AND
            event_id = $2 AND
            first_name = $3 AND
            last_name = $4 AND
            usn = $5 AND
            email = $6 AND
            contact_number = $7
        RETURNING *`,
        [teamId, eventId, firstName, lastName, usn, email, contactNumber]
      );
      if (teamMemberDeleteRes.rowCount === 0) {
        return res.status(401).json({ error: "No such team member exists" });
      }

      const data = teamMemberDeleteRes.rows;

      return res.status(200).json({
        status: "Team member deleted successfully",
        data,
      });
    } catch (error) {
      console.log("Delete Team member error", error);
      return res.status(500).json("Server error");
    }
  });
};
