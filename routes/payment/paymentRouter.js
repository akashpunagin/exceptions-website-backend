const router = require("express").Router();

require("./paymentRoutes/add")(router);
require("./paymentRoutes/delete")(router);

module.exports = router;
