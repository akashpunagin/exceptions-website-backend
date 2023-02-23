const router = require("express").Router();

require("./appConstantsRoutes/get-max-gc-member-size")(router);
require("./appConstantsRoutes/get-event-fees-strike-force")(router);
require("./appConstantsRoutes/get-event-fees-solvathon")(router);
require("./appConstantsRoutes/get-event-fees-infinity-and-beyond")(router);
require("./appConstantsRoutes/get-event-fees-all-group-events")(router);
require("./appConstantsRoutes/get-g-drive-refresh-token")(router);

require("./appConstantsRoutes/update-max-gc-member-size")(router);
require("./appConstantsRoutes/update-event-fees-strike-force")(router);
require("./appConstantsRoutes/update-event-fees-solvathon")(router);
require("./appConstantsRoutes/update-event-fees-infinity-and-beyond")(router);
require("./appConstantsRoutes/update-event-fees-all-group-events")(router);
require("./appConstantsRoutes/update-g-drive-refresh-token")(router);

module.exports = router;
