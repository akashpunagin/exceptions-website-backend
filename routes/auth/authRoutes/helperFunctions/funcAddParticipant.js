const pool = require("../../../../db/pool");
const appConstants = require("../../../../constants/appConstants");

async function addPartipant(particpantUserId, participantDetails) {
  const {
    collegeName,
    state,
    city,
    zip,
    numberOfMaleAccomodations,
    numberOfFemaleAccomodations,
  } = participantDetails;

  const { participantDetails: participantDetailsTable } =
    appConstants.SQL_TABLE;

  const newParticipantRes = await pool.query(
    `INSERT INTO ${participantDetailsTable}(
      user_id, college_name, state, city, zip,
      no_of_male_accomodations, no_of_female_accomodations
    )
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING user_id, college_name, state, city, zip`,
    [
      particpantUserId,
      collegeName,
      state,
      city,
      zip,
      numberOfMaleAccomodations,
      numberOfFemaleAccomodations,
    ]
  );

  const newParticipant = newParticipantRes.rows[0];
  console.log("ADDING PARTICIPANT: ", newParticipant);
  return { error: false, data: newParticipant };
}

module.exports = addPartipant;
