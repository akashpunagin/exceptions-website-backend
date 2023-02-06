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

module.exports = {
  isEventExistsByEventId,
  isEventExistsByEventName,
  getTeamMembersByEventId,
};
