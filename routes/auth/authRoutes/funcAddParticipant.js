const pool = require("../../../db/pool");
const appConstants = require("../../../constants/appConstants");

async function addPartipant(particpantUserId, participantDetails) {
  const { collegeName, usn, state, city, zip } = participantDetails;

  const { participantDetails: participantDetailsTable } =
    appConstants.SQL_TABLE;

  const newParticipantRes = await pool.query(
    `INSERT INTO ${participantDetailsTable}(user_id, college_name, usn, state, city, zip)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING user_id, college_name, usn, state, city, zip`,
    [particpantUserId, collegeName, usn, state, city, zip]
  );

  const newParticipant = newParticipantRes.rows[0];
  console.log("ADDING PARTICIPANT: ", newParticipant);
  return { error: false, data: newParticipant };
}

module.exports = addPartipant;
