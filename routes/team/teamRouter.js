const router = require("express").Router();

require("./teamRoutes/add")(router);
require("./teamRoutes/get")(router);
require("./teamRoutes/get-team-of-current-user")(router);
require("./teamRoutes/get-all-teams-with-team-members")(router);
require("./teamRoutes/get-specific-team-details")(router);
require("./teamRoutes/delete")(router);
require("./teamRoutes/update")(router);

module.exports = router;
