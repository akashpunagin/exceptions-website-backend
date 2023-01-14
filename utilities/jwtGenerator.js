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

module.exports = {
  accessTokenGenerator,
  refreshTokenGenerator,
};
