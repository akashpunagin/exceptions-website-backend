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

    const { details, contact } = event;

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

    await insertIntoEventDetails(eventId, details);

    if (contact !== undefined) {
      await insertIntoEventContacts(eventId, contact);
    }

    await insertIntoEventRules(eventId, rules);
    await insertIntoEventRequirements(eventId, requirements);
  }
}

main();
