const pool = require("../../../db/pool");
const appConstants = require("../../../constants/appConstants");
const {
  isUserExistsByUserEmail,
} = require("../../../dbUtils/users/dbUsersUtils");
const bcrypt = require("bcryptjs");

async function addUser(userDetails) {
  const { email, contactNumber, firstName, lastName, password } = userDetails;

  const { users } = appConstants.SQL_TABLE;

  const isUserExists = await isUserExistsByUserEmail(email);

  // if user exists throw error
  if (isUserExists) {
    return { error: true, errorMessage: "User already exists" };
  }

  // else bcrypt users password
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const bcryptPassword = await bcrypt.hash(password, salt);

  const newUserRes = await pool.query(
    `INSERT INTO ${users}(first_name, last_name, email, contact_number, password)
        VALUES($1, $2, $3, $4, $5)
        RETURNING user_id, first_name, last_name, email, contact_number, password`,
    [firstName, lastName, email, contactNumber, bcryptPassword]
  );

  const newUser = newUserRes.rows[0];
  console.log("REGISTERING USER: ", newUser);
  return { error: false, data: newUser };
}

module.exports = addUser;
