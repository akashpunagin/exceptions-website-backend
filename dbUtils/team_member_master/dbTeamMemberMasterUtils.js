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

module.exports = { isTeamMemberExistsByMemberId };
