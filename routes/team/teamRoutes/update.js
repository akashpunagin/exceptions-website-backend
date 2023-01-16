const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const { isUserExistsByUserId } = require("../../../dbUtils/users/dbUsersUtils");
const {
  isTeamHeadExists,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");
const appConstants = require("../../../constants/appConstants");

module.exports = (router) => {
  router.post("/update", [authorization, validateInputs], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMaster } = appConstants.SQL_TABLE;

    try {
      const { teamId, name, isGCConsidered } = req.body;

      const teamExistsRes = await pool.query(
        `SELECT team_id 
            FROM ${teamMaster}
            WHERE team_id = $1`,
        [teamId]
      );
      if (teamExistsRes.rowCount === 0) {
        return res.status(401).json({ error: "Team does not exists" });
      }

      const teamNameExistsRes = await pool.query(
        `SELECT team_id 
            FROM ${teamMaster}
            WHERE team_name = $1`,
        [name]
      );
      if (teamNameExistsRes.rowCount > 0) {
        return res.status(401).json({ error: "Team name already exists" });
      }

      const updateRes = await pool.query(
        `UPDATE ${teamMaster}
          SET 
            team_name = $1,
            team_is_gc_considered = $2
          WHERE team_id = $3
          RETURNING *`,
        [name, isGCConsidered, teamId]
      );

      return res.status(200).json({
        status: "Event updated successfully",
        data: updateRes.rows[0],
      });
    } catch (error) {
      console.log("Update Event error", error);
      return res.status(500).json("Server error");
    }
  });
};
