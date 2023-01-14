const router = require("express").Router();

require("./profileRoutes/me")(router);

module.exports = router;
