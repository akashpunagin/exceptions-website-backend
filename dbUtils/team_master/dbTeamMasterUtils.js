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
      return { isError: false, errorMessage: null, data: true };
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

async function getMaxTeamMembersOfTeamByTeamId(teamId) {
  const { teamMaster, teamEvents, eventMaster, appIntConstants } =
    appConstants.SQL_TABLE;

  const label = "max_gc_member_size";
  const intConstantsRes = await pool.query(
    `SELECT * FROM ${appIntConstants}
    WHERE label = $1`,
    [label]
  );
  const constantsData = intConstantsRes.rows[0];
  const maxGCMemberSize = Number.parseInt(constantsData.value);

  const teamRes = await pool.query(
    `SELECT SUM(${eventMaster}.event_max_team_size)
      FROM ${teamMaster}, ${teamEvents}, ${eventMaster}
      WHERE 
        ${teamEvents}.team_id = $1 AND
        ${teamMaster}.team_id = ${teamEvents}.team_id AND
        ${teamEvents}.event_id = ${eventMaster}.event_id AND
        ${eventMaster}.event_is_open_event = true`,
    [teamId]
  );
  const data = teamRes.rows[0];
  const maxOpenEventTeamMembers = Number.parseInt(data.sum);

  const totalMaxTeamMembers = maxGCMemberSize + maxOpenEventTeamMembers;
  return Number.parseInt(totalMaxTeamMembers);
}

module.exports = {
  isTeamHeadExists,
  getTeamIdOfUser,
  getTeamByTeamId,
  isTeamExistsByTeamId,
  isTeamExistsByTeamNameId,
  getMaxTeamMembersOfTeamByTeamId,
};
