const router = require("express").Router();

require("./teamRoutes/add")(router);
require("./teamRoutes/get")(router);
require("./teamRoutes/delete")(router);
require("./teamRoutes/update")(router);

module.exports = router;
