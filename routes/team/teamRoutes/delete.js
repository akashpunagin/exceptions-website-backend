const pool = require("../../../db/pool");
const {
  authorization,
  authorizeAdmin,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  isTeamExistsByTeamId,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");

module.exports = (router) => {
  router.delete(
    "/delete",
    [authorization, authorizeAdmin, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamMaster } = appConstants.SQL_TABLE;

      try {
        const { teamId } = req.body;

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

        const delRes = await pool.query(
          `DELETE FROM ${teamMaster}
          WHERE team_id = $1
          RETURNING *`,
          [teamId]
        );

        return res.status(200).json({
          status: "Team deleted successfully",
          data: delRes.rows[0],
        });
      } catch (error) {
        console.log("DELETE Team error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
