const router = require("express").Router();

require("./allowedEmailsRoutes/get-allowed-coordinators")(router);
require("./allowedEmailsRoutes/get-allowed-volunteers")(router);
require("./allowedEmailsRoutes/get-allowed-admins")(router);

module.exports = router;
