const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  getTeamIdOfUser,
} = require("../../../dbUtils/team_member_event/dbTeamMemberEventUtils");

module.exports = (router) => {
  router.post("/delete", [authorization, validateInputs], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMemberEvent } = appConstants.SQL_TABLE;

    try {
      const { eventId, firstName, lastName, usn, email, contactNumber } =
        req.body;

      const currentUser = req.user;

      const getTeamOfUserRes = await getTeamIdOfUser(currentUser.userId);
      if (getTeamOfUserRes.isError) {
        return res.status(401).json({ error: getTeamOfUserRes.errorMessage });
      }
      const teamId = getTeamOfUserRes.data;

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
