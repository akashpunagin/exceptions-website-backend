const router = require("express").Router();

require("./paymentRoutes/add")(router);

module.exports = router;
