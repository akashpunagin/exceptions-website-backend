const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { getUserByUserId } = require("../../../dbUtils/users/dbUsersUtils");
const {
  getTeamIdOfUser,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");

module.exports = (router) => {
  router.get("/get-max-team-members", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMaster, teamEvents, eventMaster } = appConstants.SQL_TABLE;

    try {
      const currentUser = req.user;

      const teamIdRes = await getTeamIdOfUser(currentUser.userId);
      if (teamIdRes.isError) {
        return res.status(401).json({ error: teamIdRes.errorMessage });
      }
      const teamId = teamIdRes.data;

      const teamRes = await pool.query(
        `SELECT SUM(${eventMaster}.event_max_team_size)
          FROM ${teamMaster}, ${teamEvents}, ${eventMaster}
          WHERE 
            ${teamEvents}.team_id = $1 AND
            ${teamMaster}.team_id = ${teamEvents}.team_id AND
            ${teamEvents}.event_id = ${eventMaster}.event_id`,
        [teamId]
      );
      const data = teamRes.rows[0];
      const maxTeamMembers = data.sum;

      return res.status(200).json(Number.parseInt(maxTeamMembers));
    } catch (error) {
      console.log("GET Team error", error);
      return res.status(500).json("Server error");
    }
  });
};
