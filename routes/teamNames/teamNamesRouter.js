const router = require("express").Router();

require("./teamNamesRoutes/get")(router);
require("./teamNamesRoutes/add")(router);
require("./teamNamesRoutes/delete")(router);

module.exports = router;
