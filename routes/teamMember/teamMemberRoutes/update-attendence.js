const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  isTeamMemberExistsByMemberId,
} = require("../../../dbUtils/team_member_master/dbTeamMemberMasterUtils");

module.exports = (router) => {
  router.post(
    "/update-attendence",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamMemberMaster } = appConstants.SQL_TABLE;

      try {
        const { memberId, isPresent } = req.body;

        const isTeamMemberExists = await isTeamMemberExistsByMemberId(memberId);
        if (!isTeamMemberExists) {
          return res.status(401).json({ error: "Team member does not exists" });
        }

        const updateAttendenceRes = await pool.query(
          `UPDATE ${teamMemberMaster}
            SET is_present = $1
            WHERE member_id = $2
            RETURNING *`,
          [isPresent, memberId]
        );
        if (updateAttendenceRes.rowCount === 0) {
          return res
            .status(401)
            .json({ error: "Error while updating team member attendence" });
        }
        const updatedTeamMemberData = updateAttendenceRes.rows[0];

        return res.status(200).json({
          status: "Team member attendence updated successfully",
          data: updatedTeamMemberData,
        });
      } catch (error) {
        console.log("UPDATE Team member attendence error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
