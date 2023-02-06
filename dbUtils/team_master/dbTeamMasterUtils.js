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

async function getTeamIdOfUser(userId) {
  const { teamMaster } = appConstants.SQL_TABLE;

  const currentTeamRes = await pool.query(
    `SELECT * FROM ${teamMaster}
        WHERE team_head_user = $1`,
    [userId]
  );
  if (currentTeamRes.rowCount === 0) {
    return {
      isError: true,
      errorMessage: "User does not have any team",
      data: null,
    };
  }
  const currentTeam = currentTeamRes.rows[0];
  const teamId = currentTeam.team_id;
  return { isError: false, errorMessage: null, data: teamId };
}

async function getTeamByTeamId(teamId) {
  const { teamMaster } = appConstants.SQL_TABLE;

  const currentTeamRes = await pool.query(
    `SELECT * FROM ${teamMaster}
        WHERE team_id = $1`,
    [teamId]
  );
  if (currentTeamRes.rowCount === 0) {
    return {
      isError: true,
      errorMessage: "Team does not exist",
      data: null,
    };
  }
  const currentTeam = currentTeamRes.rows[0];
  return { isError: false, errorMessage: null, data: currentTeam };
}

module.exports = { isTeamHeadExists, getTeamIdOfUser, getTeamByTeamId };
