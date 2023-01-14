const authorization = require("./authorization");
const authorizeRefreshToken = require("./authorizeRefreshToken");
const validateInputs = require("./validateInputs");
const authorizeAdmin = require("./authorizeAdmin");

module.exports = {
  authorization,
  authorizeRefreshToken,
  validateInputs,
  authorizeAdmin,
};
