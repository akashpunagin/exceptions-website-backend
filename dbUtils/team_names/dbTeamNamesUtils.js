const appConstants = require("../../constants/appConstants");
const pool = require("../../db/pool");

async function isTeamNameExistsById(teamNameId) {
  const { teamNames } = appConstants.SQL_TABLE;

  const teamNamesRes = await pool.query(
    `SELECT * FROM ${teamNames}
    WHERE id = $1`,
    [teamNameId]
  );
  const teamNamesCount = teamNamesRes.rowCount;
  if (teamNamesCount > 0) {
    return true;
  }
  return false;
}

async function isTeamNameExistsByLabel(teamNameLabel) {
  const { teamNames } = appConstants.SQL_TABLE;

  const teamNamesRes = await pool.query(
    `SELECT * FROM ${teamNames}
    WHERE label = $1`,
    [teamNameLabel]
  );
  const teamNamesData = teamNamesRes.rows;

  if (teamNamesRes.rowCount > 0) {
    return {
      isError: true,
      errorMessage: "Team name already exists",
      data: null,
    };
  }

  return { isError: false, errorMessage: null, data: teamNamesData };
}

module.exports = { isTeamNameExistsById, isTeamNameExistsByLabel };
