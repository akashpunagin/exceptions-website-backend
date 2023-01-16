const pool = require("../../../db/pool");
const {
  authorization,
  authorizeAdmin,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { isUserExistsByUserId } = require("../../../dbUtils/users/dbUsersUtils");

module.exports = (router) => {
  router.post(
    "/add",
    [authorization, authorizeAdmin, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamMaster } = appConstants.SQL_TABLE;

      try {
        const { name, headUserId, isGCConsidered } = req.body;

        const teamRes = await pool.query(
          `SELECT team_id 
            FROM ${teamMaster}
            WHERE team_name = $1`,
          [name]
        );
        if (teamRes.rowCount > 0) {
          return res.status(401).json({ error: "Team already exists" });
        }

        const isUserExists = await isUserExistsByUserId(headUserId);
        if (!isUserExists) {
          return res.status(401).json({ error: "User does not exists" });
        }

        const getTeamHeadRes = await pool.query(
          `SELECT * FROM ${teamMaster}
            WHERE team_head_user = $1`,
          [headUserId]
        );
        if (getTeamHeadRes.rowCount > 0) {
          return res
            .status(401)
            .json({ error: "User is already a team head of another team" });
        }

        const addRes = await pool.query(
          `INSERT INTO ${teamMaster}(team_name, team_head_user, team_is_gc_considered)
          VALUES($1, $2, $3)
          RETURNING *`,
          [name, headUserId, isGCConsidered]
        );

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
