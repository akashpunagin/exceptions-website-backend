const router = require("express").Router();

// Register
require("./authRoutes/registerRoutes/register-admin")(router);
require("./authRoutes/registerRoutes/register-coordinator")(router);
require("./authRoutes/registerRoutes/register-particpant")(router);
require("./authRoutes/registerRoutes/register-volunteer")(router);

// Email Verification routes
require("./authRoutes/emailVerificationRoutes/send-confirmation-email")(router);
require("./authRoutes/emailVerificationRoutes/verify-email")(router);

// Forgot password routes
require("./authRoutes/forgotPasswordRoutes/reset-password")(router);
require("./authRoutes/forgotPasswordRoutes/update-password")(router);

// Utilities routes
require("./authRoutes/utilityRoutes/refresh-token")(router);
require("./authRoutes/utilityRoutes/is-token-valid")(router);
require("./authRoutes/utilityRoutes/is-admin")(router);
require("./authRoutes/utilityRoutes/my-role")(router);
require("./authRoutes/utilityRoutes/delete-user")(router);

// Login
require("./authRoutes/loginRoutes/login")(router);

// Logout
require("./authRoutes/logoutRoutes/logout")(router);

module.exports = router;
