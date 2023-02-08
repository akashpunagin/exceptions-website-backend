const pool = require("../../../db/pool");
const {
  authorization,
  authorizeParticipant,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { isUserExistsByUserId } = require("../../../dbUtils/users/dbUsersUtils");
const {
  isTeamHeadExists,
  isTeamExistsByTeamNameId,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");
const {
  isTeamNameExistsById,
} = require("../../../dbUtils/team_names/dbTeamNamesUtils");

module.exports = (router) => {
  router.post(
    "/add",
    [authorization, authorizeParticipant, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamMaster } = appConstants.SQL_TABLE;

      try {
        const { teamNameId, isGCConsidered } = req.body;

        const currentUser = req.user;
        const headUserId = currentUser.userId;

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
          return res
            .status(401)
            .json({ error: "Team with name already exists" });
        }

        const isUserExists = await isUserExistsByUserId(headUserId);
        if (!isUserExists) {
          return res.status(401).json({ error: "User does not exists" });
        }

        const isTeamHeadUserExists = await isTeamHeadExists(headUserId);
        if (isTeamHeadUserExists) {
          return res
            .status(401)
            .json({ error: "User is already a team head of another team" });
        }

        const addRes = await pool.query(
          `INSERT INTO ${teamMaster}(team_name_id, team_head_user, team_is_gc_considered)
            VALUES($1, $2, $3)
            RETURNING *`,
          [teamNameId, headUserId, isGCConsidered]
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
