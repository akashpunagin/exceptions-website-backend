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
} = require("../../../dbUtils/team_member_event/dbTeamMemberEventUtils");

module.exports = (router) => {
  router.post("/add", [authorization, validateInputs], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMemberEvent, teamMaster } = appConstants.SQL_TABLE;

    try {
      const { eventId, firstName, lastName, usn, email, contactNumber } =
        req.body;

      const currentUser = req.user;

      const isEventExists = await isEventExistsByEventId(eventId);
      if (!isEventExists) {
        return res.status(401).json({ error: "Event does not exists" });
      }

      const getTeamOfUserRes = await getTeamIdOfUser(currentUser.userId);
      if (getTeamOfUserRes.isError) {
        return res.status(401).json({ error: getTeamOfUserRes.errorMessage });
      }
      const teamId = getTeamOfUserRes.data;

      const teamMemberExistsRes = await pool.query(
        `SELECT * FROM ${teamMemberEvent}
          WHERE 
            team_id = $1 AND
            event_id = $2 AND
            first_name = $3 AND
            last_name = $4 AND
            usn = $5 AND
            email = $6 AND
            contact_number = $7`,
        [teamId, eventId, firstName, lastName, usn, email, contactNumber]
      );
      if (teamMemberExistsRes.rowCount > 0) {
        return res
          .status(401)
          .json({ error: "Team member already exists in this team" });
      }

      const addRes = await pool.query(
        `INSERT INTO ${teamMemberEvent}(team_id, event_id, first_name, last_name, usn, email, contact_number)
          VALUES($1, $2, $3, $4, $5, $6, $7)
          RETURNING *`,
        [teamId, eventId, firstName, lastName, usn, email, contactNumber]
      );

      return res.status(200).json({
        status: "Team member added successfully",
        data: addRes.rows[0],
      });
    } catch (error) {
      console.log("ADD Team member error", error);
      return res.status(500).json("Server error");
    }
  });
};
