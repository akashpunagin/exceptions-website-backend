const pool = require("../db/pool");
const appConstants = require("../constants/appConstants");

const { eventMaster, eventMasterDetails } = appConstants.SQL_TABLE;

async function main() {
  const getRes = await pool.query(`
        SELECT * 
        FROM ${eventMaster}, ${eventMasterDetails}
        WHERE ${eventMaster}.event_id = ${eventMasterDetails}.event_id
    `);

  const data = getRes.rows;

  const objs = [];
  for (const row of data) {
    const {
      event_id: id,
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
      id,
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

  console.log(objs);
}

main();
