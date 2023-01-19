const router = require("express").Router();

require("./teamMemberRoutes/add")(router);
require("./teamMemberRoutes/get")(router);
require("./teamMemberRoutes/get-by-eventId")(router);
require("./teamMemberRoutes/add-team-member-to-event")(router);
require("./teamMemberRoutes/delete")(router);

module.exports = router;
