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
      email: member.email,
      contactNumber: member.contact_number,
    };
  });

  return data;
}

async function isTeamMemberExistsByCredentials(email, contactNumber) {
  const { teamMemberMaster } = appConstants.SQL_TABLE;

  try {
    let teamMemberExistsRes = await pool.query(
      `SELECT * FROM ${teamMemberMaster}
        WHERE email = $1`,
      [email]
    );
    if (teamMemberExistsRes.rowCount > 0) {
      return {
        isError: false,
        errorMessage: "Another team member has this email",
        data: true,
      };
    }

    teamMemberExistsRes = await pool.query(
      `SELECT * FROM ${teamMemberMaster}
        WHERE contact_number = $1`,
      [contactNumber]
    );
    if (teamMemberExistsRes.rowCount > 0) {
      return {
        isError: false,
        errorMessage: "Another team member has this contact number",
        data: true,
      };
    }

    return { isError: false, errorMessage: null, data: false };
  } catch (error) {
    return {
      isError: true,
      errorMessage:
        "There was some error while checking team member credentials",
      data: null,
    };
  }
}

async function deleteTeamMembersOfTeamId(teamId) {
  const { teamMemberMaster, teamIdTeamMember } = appConstants.SQL_TABLE;

  try {
    const teamMemberRes = await pool.query(
      `SELECT member.member_id
      FROM
        ${teamMemberMaster} as master,
        ${teamIdTeamMember} as member
      WHERE
        member.member_id = master.member_id AND
        member.team_id = $1`,
      [teamId]
    );
    let memberIds = teamMemberRes.rows;

    for (const { member_id: memberId } of memberIds) {
      await pool.query(
        `DELETE FROM ${teamMemberMaster}
        WHERE member_id = $1
        RETURNING *`,
        [memberId]
      );
    }
    return { isError: false, errorMessage: null, data: null };
  } catch (error) {
    return {
      isError: true,
      errorMessage: "There was some error while deleting team members of team",
      data: null,
    };
  }
}

module.exports = {
  isTeamMemberExistsByMemberId,
  getTeamMembersByTeamId,
  isTeamMemberExistsByCredentials,
  deleteTeamMembersOfTeamId,
};
