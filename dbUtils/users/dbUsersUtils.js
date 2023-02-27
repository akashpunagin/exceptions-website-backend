const pool = require("../../db/pool");
const appConstants = require("../../constants/appConstants");

const { users, userRole } = appConstants.SQL_TABLE;

async function isUserExistsByUserId(userId) {
  const addUsersRes = await pool.query(`SELECT user_id FROM ${users}`);
  const allUsers = addUsersRes.rows;

  const isUserExists = allUsers.some((user) => {
    return user.user_id === userId;
  });
  return isUserExists;
}

async function isUserExistsByUserEmail(email) {
  const addUsersRes = await pool.query(
    `SELECT user_id FROM ${users}
    WHERE email = $1`,
    [email]
  );

  if (addUsersRes.rowCount === 0) {
    return false;
  } else {
    return true;
  }
}

async function getUserByUserId(userId) {
  const getUserRes = await pool.query(
    `SELECT user_id, first_name, last_name, email, contact_number
    FROM ${users}
    WHERE user_id = $1`,
    [userId]
  );
  const getUser = getUserRes.rows[0];

  return {
    userId: getUser.user_id,
    firstName: getUser.first_name,
    lastName: getUser.last_name,
    email: getUser.email,
    zip: getUser.zip,
    contactNumber: getUser.contact_number,
  };
}

async function getUserRoleByUserId(userId) {
  const userRoleRes = await pool.query(
    `SELECT ur.role_admin,
      role_coordinator,
      role_volunteer,
      role_participant
    FROM ${users} as u, 
        ${userRole} as ur
    WHERE u.user_id = ur.user_id
        AND u.user_id = $1`,
    [userId]
  );
  const role = userRoleRes.rows[0];
  return role;
}

module.exports = {
  isUserExistsByUserId,
  isUserExistsByUserEmail,

  getUserByUserId,

  getUserRoleByUserId,
};
