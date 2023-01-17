const pool = require("../../../db/pool");
const {
  authorization,
  authorizeAdmin,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");

module.exports = (router) => {
  router.get("/get", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMaster, teamMemberEvent } = appConstants.SQL_TABLE;

    try {
      const currentUser = req.user;

      const teamHeadExistsRes = await pool.query(
        `SELECT * FROM ${teamMaster}
          WHERE team_head_user = $1`,
        [currentUser.userId]
      );
      if (teamHeadExistsRes.rowCount === 0) {
        return res.status(401).json({ error: "User does not have any team" });
      }

      const team = teamHeadExistsRes.rows[0];
      const teamId = team.team_id;

      const teamRes = await pool.query(
        `SELECT * FROM ${teamMemberEvent}
        WHERE team_id = $1`,
        [teamId]
      );
      const data = teamRes.rows;

      return res.status(200).json(data);
    } catch (error) {
      console.log("GET Team error", error);
      return res.status(500).json("Server error");
    }
  });
};
