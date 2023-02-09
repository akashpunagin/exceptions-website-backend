const router = require("express").Router();

require("./appConstantsRoutes/get-max-gc-member-size")(router);
require("./appConstantsRoutes/update-max-gc-member-size")(router);

module.exports = router;
