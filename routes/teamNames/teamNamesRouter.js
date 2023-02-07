const router = require("express").Router();

require("./teamNamesRoutes/get")(router);

module.exports = router;
