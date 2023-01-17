const router = require("express").Router();

require("./teamMemberRoutes/add")(router);
require("./teamMemberRoutes/get")(router);

module.exports = router;
