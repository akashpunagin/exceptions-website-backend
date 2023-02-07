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

module.exports = (router) => {
  // TODO add auth admin
  router.post("/delete", [authorization, validateInputs], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamNames } = appConstants.SQL_TABLE;

    try {
      const { id } = req.body;

      const isTeamNameExists = await isTeamNameExistsById(id);

      const teamNamesDeleteRes = await pool.query(
        `DELETE FROM ${teamNames}
        WHERE id = $1
        RETURNING *`,
        [id]
      );
      const teamNamesData = teamNamesDeleteRes.rows;

      return res.status(200).json(teamNamesData);
    } catch (error) {
      console.log("ADD Team name error", error);
      return res.status(500).json("Server error");
    }
  });
};
