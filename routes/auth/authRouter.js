const router = require("express").Router();

// Register
require("./authRoutes/register-admin")(router);
require("./authRoutes/register-coordinator")(router);
require("./authRoutes/register-particpant")(router);
require("./authRoutes/register-volunteer")(router);

// Verification routes
require("./authRoutes/send-confirmation-email")(router);
require("./authRoutes/verify-email")(router);

// Utilities routes
require("./authRoutes/reset-password")(router);
require("./authRoutes/update-password")(router);
require("./authRoutes/refresh-token")(router);
require("./authRoutes/is-token-valid")(router);
require("./authRoutes/is-admin")(router);
require("./authRoutes/my-role")(router);

// Login
require("./authRoutes/login")(router);

// Logout
require("./authRoutes/logout")(router);

// Delete user
require("./authRoutes/delete-user")(router);

module.exports = router;
