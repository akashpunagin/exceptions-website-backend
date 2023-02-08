const router = require("express").Router();

require("./teamNamesRoutes/get-all")(router);
require("./teamNamesRoutes/get-available-team-names")(router);
require("./teamNamesRoutes/add")(router);
require("./teamNamesRoutes/delete")(router);

module.exports = router;
