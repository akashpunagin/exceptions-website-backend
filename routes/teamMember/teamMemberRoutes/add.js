const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  getTeamIdOfUser,
  getMaxTeamMembersOfTeamByTeamId,
} = require("../../../dbUtils/team_master/dbTeamMasterUtils");
const {
  isTeamMemberExistsByCredentials,
} = require("../../../dbUtils/team_member_master/dbTeamMemberMasterUtils");

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

      const isTeamMemberExistsRes = await isTeamMemberExistsByCredentials(
        firstName,
        lastName,
        usn,
        email,
        contactNumber
      );
      if (isTeamMemberExistsRes.isError) {
        return res
          .status(401)
          .json({ error: isTeamMemberExistsRes.errorMessage });
      }
      const isTeamMemberExists = isTeamMemberExistsRes.data;
      if (isTeamMemberExists) {
        return res
          .status(401)
          .json({ error: "This Team member credentials already exists" });
      }

      const getTeamMembersRes = await pool.query(
        `SELECT *
        FROM ${teamIdTeamMember}
        WHERE team_id = $1`,
        [teamId]
      );
      const currentTeamMembersCount = getTeamMembersRes.rowCount;

      const maxTeamMemberCount = await getMaxTeamMembersOfTeamByTeamId(teamId);
      console.log({ currentTeamMembersCount, maxTeamMemberCount });

      if (currentTeamMembersCount >= maxTeamMemberCount) {
        return res.status(401).json({
          error: "This Team has maximum number of team members",
        });
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
