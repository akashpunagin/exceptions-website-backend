const bcrypt = require("bcryptjs");

async function generateBcryptPassword(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const bcryptPassword = await bcrypt.hash(password, salt);
  return bcryptPassword;
}

module.exports = { generateBcryptPassword };
