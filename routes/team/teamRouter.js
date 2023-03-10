const router = require("express").Router();

require("./teamRoutes/add")(router);
require("./teamRoutes/get")(router);
require("./teamRoutes/get-team-of-current-user")(router);
require("./teamRoutes/get-events-of-team")(router);
require("./teamRoutes/get-event-fees-of-team")(router);
require("./teamRoutes/get-event-fees-of-specific-team")(router);
require("./teamRoutes/get-paid-unverified")(router);
require("./teamRoutes/get-events-of-specific-team")(router);
require("./teamRoutes/get-max-team-members")(router);
require("./teamRoutes/get-all-teams-with-team-members")(router);
require("./teamRoutes/get-specific-team-details")(router);
require("./teamRoutes/get-all-team-details")(router);
require("./teamRoutes/delete")(router);
require("./teamRoutes/update")(router);
require("./teamRoutes/add-score-to-team")(router);
require("./teamRoutes/mark-team-attendance")(router);

module.exports = router;
