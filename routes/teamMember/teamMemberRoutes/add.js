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
} = require("../../../dbUtils/team_member_event/dbTeamMemberEventUtils");

module.exports = (router) => {
  router.post("/add", [authorization, validateInputs], async (req, res) => {
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

      const teamMemberExistsRes = await pool.query(
        `SELECT * FROM ${teamMemberMaster}
          WHERE
            first_name = $1 AND
            last_name = $2 AND
            usn = $3 AND
            email = $4 AND
            contact_number = $5`,
        [firstName, lastName, usn, email, contactNumber]
      );
      if (teamMemberExistsRes.rowCount > 0) {
        return res
          .status(401)
          .json({ error: "Team member already exists in this team" });
      }

      const addTeamMemberMasterRes = await pool.query(
        `INSERT INTO ${teamMemberMaster}(first_name, last_name, usn, email, contact_number)
          VALUES($1, $2, $3, $4, $5)
          RETURNING *`,
        [firstName, lastName, usn, email, contactNumber]
      );
      if (addTeamMemberMasterRes.rowCount === 0) {
        return res
          .status(401)
          .json({ error: "Error while adding team member" });
      }

      const teamMemberData = addTeamMemberMasterRes.rows[0];
      const memberId = teamMemberData.member_id;
      console.log("SEE HERE:", { teamMemberData, memberId });

      const addTeamIdTeamMemberRes = await pool.query(
        `INSERT INTO ${teamIdTeamMember}(team_id, member_id)
          VALUES($1, $2)
          RETURNING *`,
        [teamId, memberId]
      );
      if (addTeamIdTeamMemberRes.rowCount === 0) {
        return res
          .status(401)
          .json({ error: "Error while adding team member in team" });
      }
      const teamIdTeamMemberData = addTeamIdTeamMemberRes.rows[0];
      console.log("SEE HERE:", { teamIdTeamMemberData });

      return res.status(200).json({
        status: "Team member added successfully",
        data: { ...teamMemberData, teamId },
      });
    } catch (error) {
      console.log("ADD Team member error", error);
      return res.status(500).json("Server error");
    }
  });
};
