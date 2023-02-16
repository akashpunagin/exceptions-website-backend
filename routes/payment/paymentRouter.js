const router = require("express").Router();

require("./paymentRoutes/add")(router);
require("./paymentRoutes/delete")(router);
require("./paymentRoutes/is-paid")(router);
require("./paymentRoutes/update-verification")(router);
require("./paymentRoutes/get-screenshot-by-user-id")(router);

module.exports = router;
