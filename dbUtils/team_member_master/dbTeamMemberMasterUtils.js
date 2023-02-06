const pool = require("./../../db/pool");
const appConstants = require("./../../constants/appConstants");

async function isTeamMemberExistsByMemberId(memberId) {
  const { teamMemberMaster } = appConstants.SQL_TABLE;

  const teamMemberMasterRes = await pool.query(
    `SELECT member_id 
    FROM ${teamMemberMaster}
    WHERE member_id = $1`,
    [memberId]
  );
  if (teamMemberMasterRes.rowCount === 0) {
    return false;
  }
  return true;
}

async function getTeamMembersByTeamId(teamId) {
  const { teamMemberMaster, teamIdTeamMember } = appConstants.SQL_TABLE;

  const teamIdTeamMemberRes = await pool.query(
    `SELECT * 
    FROM
      ${teamIdTeamMember}, ${teamMemberMaster}
    WHERE
      ${teamIdTeamMember}.member_id = ${teamMemberMaster}.member_id AND
      ${teamIdTeamMember}.team_id = $1`,
    [teamId]
  );
  let data = teamIdTeamMemberRes.rows;

  data = data.map((member) => {
    return {
      memberId: member.member_id,
      firstName: member.first_name,
      lastName: member.last_name,
      usn: member.usn,
      email: member.email,
      contactNumber: member.contact_number,
    };
  });

  return data;
}

module.exports = { isTeamMemberExistsByMemberId, getTeamMembersByTeamId };
