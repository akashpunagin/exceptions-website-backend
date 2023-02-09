const pool = require("../../../db/pool");
const {
  authorization,
  authorizeAdmin,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { getUserByUserId } = require("../../../dbUtils/users/dbUsersUtils");

module.exports = (router) => {
  router.get("/get-team-of-current-user", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMaster, teamNames } = appConstants.SQL_TABLE;

    try {
      const currentUser = req.user;

      const teamRes = await pool.query(
        `SELECT * 
        FROM ${teamMaster}, ${teamNames}
        WHERE
          ${teamMaster}.team_name_id = ${teamNames}.id AND
          team_head_user = $1`,
        [currentUser.userId]
      );

      let data = [];
      if (teamRes.rowCount > 0) {
        const teamRow = teamRes.rows[0];

        const headUserId = teamRow.team_head_user;
        const teamNameId = teamRow.id;
        const teamName = teamRow.label;

        const headUser = await getUserByUserId(headUserId);

        data = {
          teamId: teamRow.team_id,
          teamName,
          teamName: {
            label: teamName,
            id: teamNameId,
          },
          headUser,
          isGCConsidered: teamRow.team_is_gc_considered,
          score: teamRow.team_score,
        };
      } else {
        data = {
          message: "This user has not registered any teams",
        };
      }

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET Team of current user error", error);
      return res.status(500).json("Server error");
    }
  });
};
