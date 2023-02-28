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

module.exports = {
  getAllowedCoordinatorEmails,
  getAllowedVolunteerEmails,
  getAllowedAdminEmails,
};
