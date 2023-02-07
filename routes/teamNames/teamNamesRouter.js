const router = require("express").Router();

require("./teamNamesRoutes/get")(router);
require("./teamNamesRoutes/add")(router);

module.exports = router;
