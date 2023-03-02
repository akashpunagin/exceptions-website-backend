const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  isTeamExistsByTeamId,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");
const {
  getTeamMembersByTeamId,
} = require("../../../dbUtils/team_member_master/dbTeamMemberMasterUtils");

module.exports = (router) => {
  router.post(
    "/mark-team-attendance",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamMemberMaster } = appConstants.SQL_TABLE;

      try {
        const { teamId, isPresent } = req.body;

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

        const teamMembers = await getTeamMembersByTeamId(teamId);

        for (const teamMember of teamMembers) {
          await pool.query(
            `
            UPDATE ${teamMemberMaster}
            SET is_present = $1
            WHERE member_id = $2
          `,
            [isPresent, teamMember.memberId]
          );
        }

        return res.status(200).json({
          status: "Team Attendance updated successfully",
        });
      } catch (error) {
        console.log("Mark team attendance error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
