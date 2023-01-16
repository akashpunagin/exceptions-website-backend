const pool = require("./../../db/pool");
const appConstants = require("./../../constants/appConstants");

async function isEventExistsByEventId(eventId) {
  const { eventMaster } = appConstants.SQL_TABLE;

  const eventRes = await pool.query(
    `SELECT event_id 
    FROM ${eventMaster}
    WHERE event_id = $1`,
    [eventId]
  );
  if (eventRes.rowCount === 0) {
    return false;
  }
  return true;
}

async function isEventExistsByEventName(eventName) {
  const { eventMaster } = appConstants.SQL_TABLE;

  const eventRes = await pool.query(
    `SELECT event_id 
    FROM ${eventMaster}
    WHERE event_name = $1`,
    [eventName]
  );
  if (eventRes.rowCount === 0) {
    return false;
  }
  return true;
}

module.exports = { isEventExistsByEventId, isEventExistsByEventName };
