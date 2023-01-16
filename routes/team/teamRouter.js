const router = require("express").Router();

require("./teamRoutes/add")(router);
require("./teamRoutes/get")(router);

module.exports = router;
