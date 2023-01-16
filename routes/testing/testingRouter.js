const router = require("express").Router();

require("./testingRoutes/get-all-users")(router);

module.exports = router;
