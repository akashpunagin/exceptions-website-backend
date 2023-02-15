const pool = require("../../../db/pool");
const {
  authorization,
  authorizeAdmin,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const {
  isEventExistsByEventName,
} = require("../../../dbUtils/event/dbEventUtils");
const {
  insertIntoEventGetEventId,
  insertIntoEventDetails,
  insertIntoEventContacts,
  insertIntoEventRules,
  insertIntoEventRequirements,
} = require("../../../scripts/scriptUtils");

module.exports = (router) => {
  router.post("/add", [authorization, validateInputs], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { eventMaster } = appConstants.SQL_TABLE;

    try {
      const { eventData } = req.body;

      console.log("DATA:", eventData);

      const {
        name,
        route,
        description,
        img,
        maxPoints,
        maxTeamSize,
        isOpenEvent,
      } = eventData;

      const { details, contact } = eventData;

      const { rules, requirements } = eventData;

      const eventId = await insertIntoEventGetEventId(
        name,
        route,
        description,
        img,
        maxPoints,
        maxTeamSize,
        isOpenEvent
      );

      await insertIntoEventDetails(eventId, details);

      if (contact !== undefined) {
        await insertIntoEventContacts(eventId, contact);
      }

      await insertIntoEventRules(eventId, rules);
      await insertIntoEventRequirements(eventId, requirements);

      return res.status(200).json({
        status: "Event added successfully",
        data: { eventId },
      });
    } catch (error) {
      console.log("ADD Event error", error);
      return res.status(500).json("Server error");
    }
  });
};
