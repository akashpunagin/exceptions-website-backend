const router = require("express").Router();

require("./teamMemberRoutes/add")(router);

module.exports = router;
