const router = require("express").Router();

require("./paymentsRoutes/add")(router);

module.exports = router;
