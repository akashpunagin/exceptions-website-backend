const router = require("express").Router();

require("./adminRoutes/get-participants")(router);
require("./adminRoutes/get-coordinator")(router);
require("./adminRoutes/get-volunteers")(router);

module.exports = router;
