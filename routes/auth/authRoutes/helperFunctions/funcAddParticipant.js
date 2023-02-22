const pool = require("../../../../db/pool");
const appConstants = require("../../../../constants/appConstants");

async function addPartipant(particpantUserId, participantDetails) {
  const { collegeName, usn, state, city, zip, isMale, numberOfAccomodations } =
    participantDetails;

  const { participantDetails: participantDetailsTable } =
    appConstants.SQL_TABLE;

  const newParticipantRes = await pool.query(
    `INSERT INTO ${participantDetailsTable}(user_id, college_name, usn, state, city, zip, is_male, number_of_accomodations)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING user_id, college_name, usn, state, city, zip`,
    [
      particpantUserId,
      collegeName,
      usn,
      state,
      city,
      zip,
      isMale,
      numberOfAccomodations,
    ]
  );

  const newParticipant = newParticipantRes.rows[0];
  console.log("ADDING PARTICIPANT: ", newParticipant);
  return { error: false, data: newParticipant };
}

module.exports = addPartipant;
