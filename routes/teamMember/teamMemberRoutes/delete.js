const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  getTeamIdOfUser,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");
const {
  isTeamMemberExistsByMemberId,
} = require("../../../dbUtils/team_member_master/dbTeamMemberMasterUtils");

module.exports = (router) => {
  router.post("/delete", [authorization, validateInputs], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMemberMaster } = appConstants.SQL_TABLE;

    try {
      const { memberId } = req.body;

      const currentUser = req.user;

      const getTeamOfUserRes = await getTeamIdOfUser(currentUser.userId);
      if (getTeamOfUserRes.isError) {
        return res.status(401).json({ error: getTeamOfUserRes.errorMessage });
      }
      const teamId = getTeamOfUserRes.data;

      const isTeamMemberExists = await isTeamMemberExistsByMemberId(memberId);
      if (!isTeamMemberExists) {
        return res.status(401).json({ error: "No such team member exists" });
      }

      const teamMemberDeleteRes = await pool.query(
        `DELETE FROM ${teamMemberMaster}
          WHERE member_id = $1
        RETURNING *`,
        [memberId]
      );
      if (teamMemberDeleteRes.rowCount === 0) {
        return res.status(401).json({ error: "No such team member exists" });
      }

      const data = { ...teamMemberDeleteRes.rows[0], teamId };

      return res.status(200).json({
        status: "Team member deleted successfully",
        data,
      });
    } catch (error) {
      console.log("Delete Team member error", error);
      return res.status(500).json("Server error");
    }
  });
};
