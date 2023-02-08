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

async function isTeamExistsByTeamId(teamId) {
  const { teamMaster } = appConstants.SQL_TABLE;

  try {
    const teamRes = await pool.query(
      `SELECT team_id 
        FROM ${teamMaster}
        WHERE team_id = $1`,
      [teamId]
    );
    if (teamRes.rowCount === 0) {
      return { isError: false, errorMessage: null, data: false };
    }
    return { isError: false, errorMessage: null, data: true };
  } catch (error) {
    return {
      isError: true,
      errorMessage: "There was some error while checking of team exists by id",
      data: null,
    };
  }
}

async function isTeamExistsByTeamNameId(teamNameId) {
  const { teamMaster } = appConstants.SQL_TABLE;
  try {
    const teamRes = await pool.query(
      `SELECT team_id 
        FROM ${teamMaster}
        WHERE team_name_id = $1`,
      [teamNameId]
    );
    if (teamRes.rowCount > 0) {
      return { isError: true, errorMessage: null, data: true };
    }
    return { isError: false, errorMessage: null, data: false };
  } catch (error) {
    console.log({ error });
    return {
      isError: true,
      errorMessage: "There was some error while checking if team exists",
      data: null,
    };
  }
}

module.exports = {
  isTeamHeadExists,
  getTeamIdOfUser,
  getTeamByTeamId,
  isTeamExistsByTeamId,
  isTeamExistsByTeamNameId,
};
