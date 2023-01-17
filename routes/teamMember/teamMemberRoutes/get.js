const pool = require("../../../db/pool");
const {
  authorization,
  authorizeAdmin,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  getTeamIdOfUser,
} = require("../../../dbUtils/team_member_event/dbTeamMemberEventUtils");

module.exports = (router) => {
  router.get("/get", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMemberEvent } = appConstants.SQL_TABLE;

    try {
      const currentUser = req.user;

      const getTeamOfUserRes = await getTeamIdOfUser(currentUser.userId);
      if (getTeamOfUserRes.isError) {
        return res.status(401).json({ error: getTeamOfUserRes.errorMessage });
      }
      const teamId = getTeamOfUserRes.data;

      const teamRes = await pool.query(
        `SELECT * FROM ${teamMemberEvent}
        WHERE team_id = $1`,
        [teamId]
      );
      const data = teamRes.rows.map((row) => {
        return {
          teamId: row.team_id,
          eventId: row.event_id,
          firstName: row.first_name,
          lastName: row.last_name,
          usn: row.usn,
          email: row.email,
          contactNumber: row.contact_number,
        };
      });

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET Team error", error);
      return res.status(500).json("Server error");
    }
  });
};
