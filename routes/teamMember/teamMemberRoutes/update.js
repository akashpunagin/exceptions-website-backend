const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  isEventExistsByEventId,
} = require("../../../dbUtils/event/dbEventUtils");
const {
  getTeamIdOfUser,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");
const {
  isTeamMemberExistsByMemberId,
} = require("../../../dbUtils/team_member_master/dbTeamMemberMasterUtils");

module.exports = (router) => {
  router.post("/update", [authorization, validateInputs], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMemberMaster, teamIdTeamMember } = appConstants.SQL_TABLE;

    try {
      const { memberId, firstName, lastName, usn, email, contactNumber } =
        req.body;

      const isTeamMemberExists = await isTeamMemberExistsByMemberId(memberId);
      if (!isTeamMemberExists) {
        return res.status(401).json({ error: "Team member does not exists" });
      }

      const updateTeamMemberMasterRes = await pool.query(
        `UPDATE ${teamMemberMaster}
        SET
            first_name = $1,
            last_name = $2,
            usn = $3,
            email = $4,
            contact_number = $5
        WHERE member_id = $6
          RETURNING *`,
        [firstName, lastName, usn, email, contactNumber, memberId]
      );
      if (updateTeamMemberMasterRes.rowCount === 0) {
        return res
          .status(401)
          .json({ error: "Error while updating team member" });
      }
      const updatedTeamMemberData = updateTeamMemberMasterRes.rows[0];

      return res.status(200).json({
        status: "Team member updated successfully",
        data: updatedTeamMemberData,
      });
    } catch (error) {
      console.log("UPDATE Team member error", error);
      return res.status(500).json("Server error");
    }
  });
};
