const router = require("express").Router();

require("./allowedEmailsRoutes/coodinator/get")(router);
require("./allowedEmailsRoutes/voolunteer/get")(router);
require("./allowedEmailsRoutes/admin/get")(router);

require("./allowedEmailsRoutes/coodinator/add")(router);
require("./allowedEmailsRoutes/voolunteer/add")(router);
require("./allowedEmailsRoutes/admin/add")(router);

require("./allowedEmailsRoutes/coodinator/delete")(router);
require("./allowedEmailsRoutes/voolunteer/delete")(router);
require("./allowedEmailsRoutes/admin/delete")(router);

module.exports = router;
