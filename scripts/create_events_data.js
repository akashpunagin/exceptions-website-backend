const pool = require("../db/pool");
const appConstants = require("../constants/appConstants");
const { eventsList } = require("../constants/eventList");

const {
  eventMaster,
  eventMasterRule,
  eventMasterRequirement,
  eventMasterContact,
  eventMasterDetails,
} = appConstants.SQL_TABLE;

async function insertIntoEventGetEventId(
  name,
  route,
  description,
  img,
  maxPoints,
  maxTeamSize,
  isOpenEvent
) {
  const insertRes = await pool.query(
    `INSERT INTO ${eventMaster}(
        event_name,
        event_route,
        event_description,
        event_img,
        event_max_points,
        event_max_team_size,
        event_is_open_event
    )
    VALUES (
        $1, $2, $3, $4, $5, $6, $7
    )
    RETURNING *`,
    [name, route, description, img, maxPoints, maxTeamSize, isOpenEvent]
  );

  const data = insertRes.rows[0];
  const eventId = data.event_id;

  console.log(`\n\nEVENT: ${eventId}: ${name} inserted`);

  return eventId;
}

async function insertIntoEventDetails(
  eventId,
  { to, description, img, direction, color, text, eventType }
) {
  await pool.query(
    `INSERT INTO ${eventMasterDetails}(
          event_id,
          event_to,
          event_description,
          event_img,
          event_direction,
          event_color,
          event_text,
          event_type
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8
        )
        RETURNING *`,
    [eventId, to, description, img, direction, color, text, eventType]
  );
  console.log(`EVENT: ${eventId} details inserted`);
}

async function insertIntoEventContacts(eventId, { name, email, phone }) {
  await pool.query(
    `INSERT INTO ${eventMasterContact}(
                event_id,
                event_contact_name,
                event_contact_email,
                event_contact_phone
            )
            VALUES (
                $1, $2, $3, $4
            )
            RETURNING *`,
    [eventId, name, email, phone]
  );
  console.log(`EVENT: ${eventId} conact inserted`);
}

async function insertIntoEventRules(eventId, rules) {
  for (const rule of rules) {
    await pool.query(
      `INSERT INTO ${eventMasterRule}(
                      event_id,
                      event_rule
                  )
                  VALUES (
                      $1, $2
                  )
                  RETURNING *`,
      [eventId, rule]
    );
    console.log(`EVENT: ${eventId} rule inserted`);
  }
  console.log(`EVENT: ${eventId} ALL RULES inserted`);
}

async function insertIntoEventRequirements(eventId, requirements) {
  for (const requirement of requirements) {
    await pool.query(
      `INSERT INTO ${eventMasterRequirement}(
                        event_id,
                        event_requirement
                    )
                    VALUES (
                        $1, $2
                    )
                    RETURNING *`,
      [eventId, requirement]
    );
    console.log(`EVENT: ${eventId} requirements inserted`);
  }
  console.log(`EVENT: ${eventId} ALL REQUIREMENT inserted`);
}

async function main() {
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
