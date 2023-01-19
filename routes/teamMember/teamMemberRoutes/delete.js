const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  getTeamIdOfUser,
} = require("../../../dbUtils/team_member_event/dbTeamMemberEventUtils");

module.exports = (router) => {
  router.post("/delete", [authorization, validateInputs], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMemberMaster, teamIdTeamMember } = appConstants.SQL_TABLE;

    try {
      const { firstName, lastName, usn, email, contactNumber } = req.body;

      const currentUser = req.user;

      const getTeamOfUserRes = await getTeamIdOfUser(currentUser.userId);
      if (getTeamOfUserRes.isError) {
        return res.status(401).json({ error: getTeamOfUserRes.errorMessage });
      }
      const teamId = getTeamOfUserRes.data;

      const teamMemberDeleteRes = await pool.query(
        `DELETE FROM ${teamMemberMaster}
          WHERE 
            first_name = $1 AND
            last_name = $2 AND
            usn = $3 AND
            email = $4 AND
            contact_number = $5
        RETURNING *`,
        [firstName, lastName, usn, email, contactNumber]
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
