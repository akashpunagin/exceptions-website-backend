const { eventsList } = require("../constants/eventList");
const {
  deleteAllEventsTableData,
  insertIntoEventContacts,
  insertIntoEventDetails,
  insertIntoEventGetEventId,
  insertIntoEventRequirements,
  insertIntoEventRules,
} = require("./scriptUtils");

async function main() {
  await deleteAllEventsTableData();

  for (const event of eventsList) {
    const {
      name,
      route,
      description,
      img,
      maxPoints,
      maxTeamSize,
      isOpenEvent,
    } = event;

    const { details, contacts } = event;

    const { rules, requirements } = event;

    const eventId = await insertIntoEventGetEventId(
      name,
      route,
      description,
      img,
      maxPoints,
      maxTeamSize,
      isOpenEvent
    );

    if (details !== undefined) {
      await insertIntoEventDetails(eventId, details);
    }

    await insertIntoEventContacts(eventId, contacts);

    await insertIntoEventRules(eventId, rules);
    await insertIntoEventRequirements(eventId, requirements);
  }
}

main();
