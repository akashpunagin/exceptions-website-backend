const appConstants = require("../../constants/appConstants");
const pool = require("../../db/pool");

async function isTeamHeadExists(teamHeadId) {
  const { teamMaster } = appConstants.SQL_TABLE;

  const getTeamHeadRes = await pool.query(
    `SELECT * FROM ${teamMaster}
    WHERE team_head_user = $1`,
    [teamHeadId]
  );

  if (getTeamHeadRes.rowCount > 0) {
    return true;
  }

  return false;
}

module.exports = { isTeamHeadExists };
