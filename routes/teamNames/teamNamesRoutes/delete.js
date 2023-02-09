const pool = require("../../../db/pool");
const {
  authorization,
  authorizeAdmin,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { getUserByUserId } = require("../../../dbUtils/users/dbUsersUtils");
const {
  isTeamNameExistsById,
} = require("../../../dbUtils/team_names/dbTeamNamesUtils");
const {
  isTeamExistsByTeamNameId,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");

module.exports = (router) => {
  router.post(
    "/delete",
    [authorization, authorizeAdmin, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamNames } = appConstants.SQL_TABLE;

      try {
        const { id } = req.body;

        const isTeamNameExists = await isTeamNameExistsById(id);
        if (!isTeamNameExists) {
          return res.status(401).json({ message: "Team name does not exist" });
        }

        const isTeamExistsRes = await isTeamExistsByTeamNameId(id);
        if (isTeamExistsRes.isError) {
          return res.status(401).json({ error: isTeamExistsRes.errorMessage });
        }
        const isTeamExists = isTeamExistsRes.data;
        if (isTeamExists) {
          return res.status(401).json({
            error:
              "Cannot delete team name because some team has already taken this name",
          });
        }

        const teamNamesDeleteRes = await pool.query(
          `DELETE FROM ${teamNames}
            WHERE id = $1
            RETURNING *`,
          [id]
        );
        const teamNamesData = teamNamesDeleteRes.rows[0];

        return res.status(200).json({
          message: "Team name deleted successcully",
          teamNamesData,
        });
      } catch (error) {
        console.log("DELETE Team name error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
