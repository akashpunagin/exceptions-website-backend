const router = require("express").Router();

require("./adminRoutes/get-participants")(router);

module.exports = router;
