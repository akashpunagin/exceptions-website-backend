const pool = require("../db/pool");
const appConstants = require("../constants/appConstants");
const { getMysteryEventName } = require("../dbUtils/event/dbEventUtils");

const { eventMaster, eventMasterDetails } = appConstants.SQL_TABLE;

async function getShortEventDetails() {
  const getRes = await pool.query(`
        SELECT * 
        FROM ${eventMaster}, ${eventMasterDetails}
        WHERE ${eventMaster}.event_id = ${eventMasterDetails}.event_id
    `);

  const data = getRes.rows;

  const objs = [];
  for (const row of data) {
    const {
      event_id: eventId,
      event_name: name,
      event_to: to,
      event_description: description,
      event_img: img,
      event_direction: direction,
      event_color: color,
      event_text: text,
      event_type: eventType,
    } = row;

    const obj = {
      eventId,
      name,
      to,
      description,
      img,
      direction,
      color,
      text,
      eventType,
    };
    objs.push(obj);
  }

  const getMysteryEventRes = await pool.query(
    `
  SELECT * 
    FROM ${eventMaster}
    WHERE ${eventMaster}.event_name = $1
`,
    [getMysteryEventName()]
  );
  const mysteryEventData = getMysteryEventRes.rows[0];

  const mysteryEventJson = {
    eventId: mysteryEventData.event_id,
    eventName: mysteryEventData.event_name,
    eventRoute: mysteryEventData.event_route,
    eventDescription: mysteryEventData.event_description,
    eventImg: mysteryEventData.event_img,
    eventMaxPoints: mysteryEventData.event_max_points,
    eventMaxTeamSize: mysteryEventData.event_max_team_size,
    eventIsOpenEvent: mysteryEventData.event_is_open_event,
  };

  return { detailedEvents: objs, mysteryEvent: mysteryEventJson };
}

module.exports = { getShortEventDetails };
