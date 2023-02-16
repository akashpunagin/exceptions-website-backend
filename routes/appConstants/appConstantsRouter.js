const router = require("express").Router();

require("./appConstantsRoutes/get-max-gc-member-size")(router);
require("./appConstantsRoutes/update-max-gc-member-size")(router);
require("./appConstantsRoutes/get-event-fees-strike-force")(router);
require("./appConstantsRoutes/get-event-fees-solvathon")(router);
require("./appConstantsRoutes/get-event-fees-infinity-and-beyond")(router);
require("./appConstantsRoutes/get-event-fees-all-group-events")(router);

module.exports = router;
