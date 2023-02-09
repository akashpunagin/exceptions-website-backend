const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const {
  isTeamExistsByTeamNameId,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");
const appConstants = require("../../../constants/appConstants");
const {
  getTeamIdOfUser,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");
const {
  isTeamNameExistsById,
} = require("../../../dbUtils/team_names/dbTeamNamesUtils");

module.exports = (router) => {
  router.post("/update", [authorization, validateInputs], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMaster } = appConstants.SQL_TABLE;

    try {
      const { teamNameId } = req.body;

      const currentUser = req.user;
      const teamIdRes = await getTeamIdOfUser(currentUser.userId);
      if (teamIdRes.isError) {
        return res.status(401).json({ error: teamIdRes.errorMessage });
      }
      const teamId = teamIdRes.data;

      const isTeamNameExists = await isTeamNameExistsById(teamNameId);
      if (!isTeamNameExists) {
        return res.status(401).json({ error: "Team name does not exists" });
      }

      const isTeamExistsByTeamIdRes = await isTeamExistsByTeamNameId(
        teamNameId
      );
      if (isTeamExistsByTeamIdRes.isError) {
        return res
          .status(401)
          .json({ error: isTeamExistsByTeamIdRes.errorMessage });
      }
      const isTeamExistsByTeamName = isTeamExistsByTeamIdRes.data;
      if (isTeamExistsByTeamName) {
        return res.status(401).json({ error: "Team with name already exists" });
      }

      const updateRes = await pool.query(
        `UPDATE ${teamMaster}
          SET team_name_id = $1
          WHERE team_id = $2
          RETURNING *`,
        [teamNameId, teamId]
      );

      return res.status(200).json({
        status: "Team updated successfully",
        data: updateRes.rows[0],
      });
    } catch (error) {
      console.log("Update Team error", error);
      return res.status(500).json("Server error");
    }
  });
};
