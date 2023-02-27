const pool = require("./../../db/pool");
const appConstants = require("./../../constants/appConstants");
const { getTeamIdOfUser } = require("../team_master/dbTeamMasterUtils");

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

async function getEventsOfTeam(teamId) {
  const { teamMaster, teamEvents, eventMaster } = appConstants.SQL_TABLE;

  const teamRes = await pool.query(
    `SELECT ${eventMaster}.*
    FROM ${teamMaster}, ${teamEvents}, ${eventMaster}
    WHERE 
      ${teamMaster}.team_id = ${teamEvents}.team_id AND
      ${teamEvents}.event_id = ${eventMaster}.event_id AND
      ${teamEvents}.team_id = $1`,
    [teamId]
  );
  let data = teamRes.rows;

  data = data.map((row) => {
    return {
      eventId: row.event_id,
      eventName: row.event_name,
      eventDescription: row.event_description,
      eventMaxPoints: row.event_max_points,
      eventMaxTeamSize: row.event_max_team_size,
      eventIsOpenEvent: row.event_is_open_event,
    };
  });
  return data;
}

async function isSolvathonEventExistsForUserId(userId) {
  const teamIdRes = await getTeamIdOfUser(userId);

  if (teamIdRes.isError) {
    return { isError: true, errorMessage: teamIdRes.errorMessage, data: null };
  }
  const teamId = teamIdRes.data;

  const eventData = await getEventsOfTeam(teamId);

  const isSolvathonExists = eventData.some((event) => {
    return event.eventName === getSolvathonEventName();
  });
  return { isError: false, errorMessage: null, data: isSolvathonExists };
}

function getInfinityAndBeyondEventName() {
  return "Infinity & Beyond";
}

function getSolvathonEventName() {
  return "Solveathon";
}

function getStrikeForceEventName() {
  return "Strike Force";
}

function getMysteryEventName() {
  return "Mystery Event";
}

async function getInfinityAndBeyondEventId() {
  const { eventMaster } = appConstants.SQL_TABLE;

  const getRes = await pool.query(
    `SELECT * FROM ${eventMaster}
    WHERE event_name = $1`,
    [getInfinityAndBeyondEventName()]
  );
  const eventId = getRes.rows[0].event_id;
  return eventId;
}

async function getSolvathonEventId() {
  const { eventMaster } = appConstants.SQL_TABLE;

  const getRes = await pool.query(
    `SELECT * FROM ${eventMaster}
    WHERE event_name = $1`,
    [getSolvathonEventName()]
  );
  const eventId = getRes.rows[0].event_id;
  return eventId;
}

async function getStrikeForceEventId() {
  const { eventMaster } = appConstants.SQL_TABLE;

  const getRes = await pool.query(
    `SELECT * FROM ${eventMaster}
    WHERE event_name = $1`,
    [getStrikeForceEventName()]
  );
  const eventId = getRes.rows[0].event_id;
  return eventId;
}

module.exports = {
  isEventExistsByEventId,
  isOpenEventExistsByEventId,
  isEventExistsByEventName,
  getTeamMembersByEventId,
  getEventByEventId,
  getGroupEvents,
  getEventsOfTeam,
  isSolvathonEventExistsForUserId,

  getInfinityAndBeyondEventName,
  getSolvathonEventName,
  getStrikeForceEventName,
  getMysteryEventName,

  getInfinityAndBeyondEventId,
  getSolvathonEventId,
  getStrikeForceEventId,
};
