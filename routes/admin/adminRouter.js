const router = require("express").Router();

require("./adminRoutes/get-participants")(router);
require("./adminRoutes/get-coordinator")(router);
require("./adminRoutes/get-volunteers")(router);
require("./adminRoutes/get-total-fees")(router);
require("./adminRoutes/get-open-event-total-teams")(router);
require("./adminRoutes/get-total-team-members")(router);
require("./adminRoutes/get-group-event-total-teams")(router);
require("./adminRoutes/get-total-team-members-of-group-events")(router);

module.exports = router;
