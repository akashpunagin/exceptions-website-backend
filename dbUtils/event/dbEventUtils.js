const pool = require("./../../db/pool");
const appConstants = require("./../../constants/appConstants");

async function getEventByEventId(eventId) {
  const { eventMaster } = appConstants.SQL_TABLE;

  try {
    const eventRes = await pool.query(
      `SELECT * 
      FROM ${eventMaster}
      WHERE event_id = $1`,
      [eventId]
    );
    let eventData = eventRes.rows[0];
    const {
      event_name: eventName,
      event_description: eventDescription,
      event_max_points: eventMaxPoints,
      event_max_team_size: eventMaxTeamSize,
      event_is_open_event: eventIsOpenEvent,
    } = eventData;

    eventData = {
      eventId,
      eventName,
      eventDescription,
      eventMaxPoints,
      eventMaxTeamSize,
      eventIsOpenEvent,
    };

    return { isError: null, errorMessage: null, data: eventData };
  } catch (error) {
    return {
      isError: true,
      errorMessage: "Event does not exist",
      data: null,
    };
  }
}

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

async function isOpenEventExistsByEventId(eventId) {
  const { eventMaster } = appConstants.SQL_TABLE;

  const eventRes = await pool.query(
    `SELECT event_id 
    FROM ${eventMaster}
    WHERE 
      event_is_open_event = true AND
      event_id = $1`,
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

async function getTeamMembersByEventId(eventId) {
  const {
    eventMaster,
    teamIdTeamMemberEvent,
    teamIdTeamMember,
    teamMemberMaster,
  } = appConstants.SQL_TABLE;

  const eventRes = await pool.query(
    `SELECT * 
    FROM ${eventMaster}, ${teamIdTeamMemberEvent}, ${teamIdTeamMember}, ${teamMemberMaster}
    WHERE
      ${eventMaster}.event_id = ${teamIdTeamMemberEvent}.event_id AND
      ${teamIdTeamMemberEvent}.team_id_team_member_id = ${teamIdTeamMember}.team_id_team_member_id AND
      ${teamIdTeamMember}.member_id = ${teamMemberMaster}.member_id AND
      ${teamIdTeamMemberEvent}.event_id = $1`,
    [eventId]
  );
  let data = eventRes.rows;

  data = data.map((member) => {
    return {
      teamId: member.team_id,

      memberId: member.member_id,
      firstName: member.first_name,
      lastName: member.last_name,
      usn: member.usn,
      email: member.email,
      contactNumber: member.contact_number,
    };
  });

  return data;
}

async function getGroupEvents() {
  const { eventMaster } = appConstants.SQL_TABLE;

  const eventRes = await pool.query(
    `SELECT event_id 
    FROM ${eventMaster}
    WHERE event_is_open_event = false`
  );
  let data = eventRes.rows;
  data = data.map((event) => {
    return {
      eventId: event.event_id,
      name: event.event_name,
      description: event.event_description,
      maxPoints: event.event_max_points,
      maxTeamSize: event.event_max_team_size,
      isOpenEvent: event.event_is_open_event,
    };
  });
  return data;
}

module.exports = {
  isEventExistsByEventId,
  isOpenEventExistsByEventId,
  isEventExistsByEventName,
  getTeamMembersByEventId,
  getEventByEventId,
  getGroupEvents,
};
