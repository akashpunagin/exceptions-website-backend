const router = require("express").Router();

require("./teamMemberRoutes/add")(router);
require("./teamMemberRoutes/get")(router);
require("./teamMemberRoutes/update")(router);
require("./teamMemberRoutes/delete")(router);

require("./teamMemberRoutes/event/get-by-eventId")(router);
require("./teamMemberRoutes/event/get-event-of-team-member")(router);
require("./teamMemberRoutes/event/add-team-member-to-event")(router);
require("./teamMemberRoutes/event/remove-team-member-from-event")(router);

module.exports = router;
