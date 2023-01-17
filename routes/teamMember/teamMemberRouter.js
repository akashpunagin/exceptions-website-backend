const router = require("express").Router();

require("./teamMemberRoutes/add")(router);
require("./teamMemberRoutes/get")(router);
require("./teamMemberRoutes/delete")(router);

module.exports = router;
