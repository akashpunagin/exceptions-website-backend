const router = require("express").Router();

require("./userRoutes/get-user-by-id")(router);

module.exports = router;
