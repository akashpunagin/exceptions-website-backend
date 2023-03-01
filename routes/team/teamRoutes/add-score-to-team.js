const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const {
  isTeamExistsByTeamNameId,
  isTeamExistsByTeamId,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");
const appConstants = require("../../../constants/appConstants");
const {
  getTeamIdOfUser,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");
const {
  isTeamNameExistsById,
} = require("../../../dbUtils/team_names/dbTeamNamesUtils");

module.exports = (router) => {
  router.post(
    "/add-score-to-team",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamMaster } = appConstants.SQL_TABLE;

      try {
        const { score, teamId } = req.body;

        const isTeamExistsByTeamIdRes = await isTeamExistsByTeamId(teamId);
        if (isTeamExistsByTeamIdRes.isError) {
          return res
            .status(401)
            .json({ error: isTeamExistsByTeamIdRes.errorMessage });
        }
        const isTeamExists = isTeamExistsByTeamIdRes.data;
        if (!isTeamExists) {
          return res.status(401).json({ error: "Team does not exists" });
        }

        const getRes = await pool.query(
          `
        SELECT * FROM ${teamMaster}
        WHERE team_id = $1`,
          [teamId]
        );

        const teamCurrentScore = getRes.rows[0].team_score;

        const finalScore = teamCurrentScore + score;

        const updateRes = await pool.query(
          `UPDATE ${teamMaster}
          SET team_score = $1
          WHERE team_id = $2
          RETURNING *`,
          [finalScore, teamId]
        );
        const data = updateRes.rows[0];

        return res.status(200).json({
          status: "Team score updated successfully",
          data,
        });
      } catch (error) {
        console.log("Add score to team error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
