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

async function main() {
  const getRes = await pool.query(`
  SELECT * 
  FROM
    ${eventMaster},
    ${eventMasterContact}
  WHERE
    ${eventMaster}.event_id = ${eventMasterContact}.event_id
  `);

  const data = getRes.rows;

  const objs = [];
  for (const row of data) {
    const {
      event_id: id,
      event_name: name,
      event_description: description,
      event_img: img,

      event_max_points: maxPoints,
      event_max_team_size: maxTeamSize,
      event_is_open_event: isOpenEvent,
    } = row;

    const {
      event_contact_name: contactName,
      event_contact_email: contactEmail,
      event_contact_phone: contactPhone,
    } = row;

    const rules = await getRulesByEventId(id);

    const requirements = await getRequirementsByEventId(id);

    const obj = {
      id,
      name,
      description,
      img,
      rules,
      requirements,
      maxPoints,
      maxTeamSize,
      isOpenEvent,
      contact: {
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
      },
    };

    objs.push(obj);
  }

  console.log(objs);
}

main();
