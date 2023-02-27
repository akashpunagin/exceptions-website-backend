const router = require("express").Router();

require("./adminRoutes/get-participants")(router);
require("./adminRoutes/get-coordinator")(router);
require("./adminRoutes/get-volunteers")(router);
require("./adminRoutes/get-total-fees")(router);

module.exports = router;
