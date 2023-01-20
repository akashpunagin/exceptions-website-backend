const router = require("express").Router();

require("./teamMemberRoutes/add")(router);
require("./teamMemberRoutes/get")(router);
require("./teamMemberRoutes/event/get-by-eventId")(router);
require("./teamMemberRoutes/event/add-team-member-to-event")(router);
require("./teamMemberRoutes/event/remove-team-member-from-event")(router);
require("./teamMemberRoutes/delete")(router);

module.exports = router;
