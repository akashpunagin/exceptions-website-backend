const router = require("express").Router();

require("./eventRoutes/add")(router);
require("./eventRoutes/delete")(router);
require("./eventRoutes/get-long")(router);
require("./eventRoutes/get-short")(router);
require("./eventRoutes/get-open-events")(router);
require("./eventRoutes/get-team-members-by-event-id")(router);
require("./eventRoutes/update")(router);

module.exports = router;
