const pool = require("../../db/pool");
const appConstants = require("../../constants/appConstants");

const { users, userRole, userPermission } = appConstants.SQL_TABLE;

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
    `SELECT user_id, first_name, last_name, email, country, state, city, zip, contact_number, address
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
    address: getUser.address,
    country: getUser.country,
    state: getUser.state,
    city: getUser.city,
    zip: getUser.zip,
    contactNumber: getUser.contact_number,
  };
}

async function getUserRoleByUserId(userId) {
  const userRoleRes = await pool.query(
    `SELECT ur.role_admin, ur.role_customer
    FROM ${users} as u, 
        ${userRole} as ur
    WHERE u.user_id = ur.user_id
        AND u.user_id = $1`,
    [userId]
  );
  const role = userRoleRes.rows[0];
  return role;
}

async function getUserPermissionByUserId(userId) {
  const userPermissionRes = await pool.query(
    `SELECT up.perm_view_tweet, up.perm_send_tweet
    FROM ${users} as u, 
        ${userPermission} as up
    WHERE u.user_id = up.user_id
        AND u.user_id = $1`,
    [userId]
  );
  const userPermission = userPermissionRes.rows[0];
  return userPermission;
}

module.exports = {
  isUserExistsByUserId,
  isUserExistsByUserEmail,

  getUserByUserId,

  getUserRoleByUserId,
  getUserPermissionByUserId,
};
