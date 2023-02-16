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

async function getRulesByEventId(eventId) {
  const getRes = await pool.query(
    `
  SELECT 
    ${eventMasterRule}.*
  FROM
    ${eventMaster},
    ${eventMasterRule}
  WHERE
    ${eventMaster}.event_id = ${eventMasterRule}.event_id AND
    ${eventMasterRule}.event_id = $1
  `,
    [eventId]
  );

  const data = getRes.rows;

  const rules = [];
  for (const ruleData of data) {
    const { event_rule: rule } = ruleData;
    rules.push(rule);
  }
  return rules;
}

async function getRequirementsByEventId(eventId) {
  const getRes = await pool.query(
    `
  SELECT
    ${eventMasterRequirement}.*
  FROM
    ${eventMaster},
    ${eventMasterRequirement}
  WHERE
    ${eventMaster}.event_id = ${eventMasterRequirement}.event_id AND
    ${eventMasterRequirement}.event_id = $1
  `,
    [eventId]
  );

  const data = getRes.rows;

  const requirements = [];
  for (const ruleRequirement of data) {
    const { event_requirement: requirement } = ruleRequirement;
    requirements.push(requirement);
  }
  return requirements;
}

async function getContactsByEventId(eventId) {
  const getRes = await pool.query(
    `
  SELECT
    ${eventMasterContact}.*
  FROM
    ${eventMaster},
    ${eventMasterContact}
  WHERE
    ${eventMaster}.event_id = ${eventMasterContact}.event_id AND
    ${eventMasterContact}.event_id = $1
  `,
    [eventId]
  );

  const data = getRes.rows;

  const contacts = [];
  for (const contact of data) {
    const {
      event_contact_name: contactName,
      event_contact_email: contactEmail,
      event_contact_type: contactType,
      event_contact_phone: contactPhone,
    } = contact;
    contacts.push({ contactName, contactEmail, contactType, contactPhone });
  }
  return contacts;
}

async function getLongEventDetails() {
  const getRes = await pool.query(`
    SELECT * 
    FROM ${eventMaster}
  `);

  const data = getRes.rows;

  const objs = [];
  for (const row of data) {
    const {
      event_id: eventId,
      event_name: name,
      event_description: description,
      event_img: img,

      event_max_points: maxPoints,
      event_max_team_size: maxTeamSize,
      event_is_open_event: isOpenEvent,
    } = row;

    const rules = await getRulesByEventId(eventId);

    const requirements = await getRequirementsByEventId(eventId);

    const contacts = await getContactsByEventId(eventId);

    const obj = {
      eventId,
      name,
      description,
      img,
      rules,
      requirements,
      contacts,
      maxPoints,
      maxTeamSize,
      isOpenEvent,
    };

    objs.push(obj);
  }

  return objs;
}

module.exports = { getLongEventDetails };
