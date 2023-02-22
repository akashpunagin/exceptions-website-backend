const router = require("express").Router();

require("./testingRoutes/get-all-users")(router);
require("./testingRoutes/get-all-users-participants")(router);

module.exports = router;
