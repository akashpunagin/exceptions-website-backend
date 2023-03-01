const pool = require("../../db/pool");
const appConstants = require("../../constants/appConstants");

const {
  allowedEmailsAdmin,
  allowedEmailsCoordinators,
  allowedEmailsVolunteers,
} = appConstants.SQL_TABLE;

async function getAllowedCoordinatorEmails() {
  const getRes = await pool.query(`SELECT * FROM ${allowedEmailsCoordinators}`);
  const data = getRes.rows;
  return data;
}

async function getAllowedVolunteerEmails() {
  const getRes = await pool.query(`SELECT * FROM ${allowedEmailsVolunteers}`);
  const data = getRes.rows;
  return data;
}

async function getAllowedAdminEmails() {
  const getRes = await pool.query(`SELECT * FROM ${allowedEmailsAdmin}`);
  const data = getRes.rows;
  return data;
}

async function isAllowedAdminEmailExists(email) {
  const getRes = await pool.query(
    `SELECT * FROM ${allowedEmailsAdmin}
    WHERE email = $1`,
    [email]
  );
  if (getRes.rowCount > 0) {
    return true;
  } else {
    return false;
  }
}
async function isAllowedCoordinatorEmailExists(email) {
  const getRes = await pool.query(
    `SELECT * FROM ${allowedEmailsCoordinators}
    WHERE email = $1`,
    [email]
  );
  if (getRes.rowCount > 0) {
    return true;
  } else {
    return false;
  }
}

async function isAllowedVolunteerEmailExists(email) {
  const getRes = await pool.query(
    `SELECT * FROM ${allowedEmailsVolunteers}
    WHERE email = $1`,
    [email]
  );
  if (getRes.rowCount > 0) {
    return true;
  } else {
    return false;
  }
}

async function addAllowedAdminEmails(email) {
  const getRes = await pool.query(
    `INSERT INTO ${allowedEmailsAdmin}(email)
    VALUES ($1)
    RETURNING *`,
    [email]
  );
  const data = getRes.rows;
  return data;
}

async function addAllowedCoordinatorEmails(email) {
  const getRes = await pool.query(
    `INSERT INTO ${allowedEmailsCoordinators}(email)
    VALUES ($1)
    RETURNING *`,
    [email]
  );
  const data = getRes.rows;
  return data;
}

async function addAllowedVolunteerEmails(email) {
  const getRes = await pool.query(
    `INSERT INTO ${allowedEmailsVolunteers}(email)
    VALUES ($1)
    RETURNING *`,
    [email]
  );
  const data = getRes.rows;
  return data;
}

async function deleteAllowedAdminEmails(email) {
  const getRes = await pool.query(
    `DELETE FROM ${allowedEmailsAdmin}
    WHERE email = $1
    RETURNING *`,
    [email]
  );
  const data = getRes.rows;
  return data;
}

async function deleteAllowedCoordinatorsEmails(email) {
  const getRes = await pool.query(
    `DELETE FROM ${allowedEmailsCoordinators}
    WHERE email = $1
    RETURNING *`,
    [email]
  );
  const data = getRes.rows;
  return data;
}

async function deleteAllowedVolunteersEmails(email) {
  const getRes = await pool.query(
    `DELETE FROM ${allowedEmailsVolunteers}
    WHERE email = $1
    RETURNING *`,
    [email]
  );
  const data = getRes.rows;
  return data;
}

module.exports = {
  getAllowedCoordinatorEmails,
  getAllowedVolunteerEmails,
  getAllowedAdminEmails,

  isAllowedAdminEmailExists,
  isAllowedCoordinatorEmailExists,
  isAllowedVolunteerEmailExists,

  addAllowedAdminEmails,
  addAllowedCoordinatorEmails,
  addAllowedVolunteerEmails,

  deleteAllowedAdminEmails,
  deleteAllowedCoordinatorsEmails,
  deleteAllowedVolunteersEmails,
};
