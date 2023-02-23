const pool = require("../../db/pool");
const appConstants = require("../../constants/appConstants");

const { appVarcharConstants } = appConstants.SQL_TABLE;

async function updateRefreshToken(refreshToken) {
  const label = "g_drive_refresh_token";

  await pool.query(
    `UPDATE ${appVarcharConstants}
    SET value = $1
    WHERE label = $2
    RETURNING *`,
    [refreshToken, label]
  );
}

async function getRefreshToken() {
  const label = "g_drive_refresh_token";

  const getRes = await pool.query(
    `SELECT * FROM ${appVarcharConstants}
    WHERE label = $1`,
    [label]
  );
  const data = getRes.rows[0];
  const refreshToken = data.value;
  return refreshToken;
}

module.exports = {
  updateRefreshToken,
  getRefreshToken,
};
