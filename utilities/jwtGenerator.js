const jwt = require("jsonwebtoken");
const payloadGenerator = require("./payloadGenerator");
require("dotenv").config();

function accessTokenGenerator(user) {
  const payload = payloadGenerator(user);

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
}

function refreshTokenGenerator(user) {
  const payload = payloadGenerator(user);

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
}

function resetPasswordTokenGenerator(user) {
  const {
    password: passwordHash,
    user_id: userId,
    created_at: createdAt,
  } = user;

  const payload = payloadGenerator(user);

  const jwtSecret = passwordResetJwtSecretGenerator(passwordHash, createdAt);

  return jwt.sign(payload, jwtSecret, {
    expiresIn: process.env.RESET_PASSWORD_TOKEN_EXPIRY,
  });
}

function passwordResetJwtSecretGenerator(passwordHash, createdAt) {
  const jwtSecret = `${passwordHash}-${createdAt}`;
  return jwtSecret;
}

module.exports = {
  accessTokenGenerator,
  refreshTokenGenerator,
  resetPasswordTokenGenerator,
  passwordResetJwtSecretGenerator,
};
