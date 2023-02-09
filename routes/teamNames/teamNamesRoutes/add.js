const pool = require("../../../db/pool");
const {
  authorization,
  authorizeAdmin,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { getUserByUserId } = require("../../../dbUtils/users/dbUsersUtils");
const {
  isTeamNameExistsByLabel,
} = require("../../../dbUtils/team_names/dbTeamNamesUtils");

module.exports = (router) => {
  router.post(
    "/add",
    [authorization, authorizeAdmin, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamNames } = appConstants.SQL_TABLE;

      try {
        const { label } = req.body;

        const isTeamNameExistsByLabelRes = await isTeamNameExistsByLabel(label);
        if (isTeamNameExistsByLabelRes.isError) {
          return res
            .status(401)
            .json({ error: isTeamNameExistsByLabelRes.errorMessage });
        }

        const teamNamesAddRes = await pool.query(
          `INSERT INTO ${teamNames}(label)
          VALUES ($1)
          RETURNING *`,
          [label]
        );
        const data = teamNamesAddRes.rows;

        return res.status(200).json(data);
      } catch (error) {
        console.log("ADD Team name error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
