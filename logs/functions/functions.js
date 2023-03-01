const fs = require("fs");
const { getUserByUserId } = require("../../dbUtils/users/dbUsersUtils");

async function logPaymentUpdateVerification(userId, participantId, isVerified) {
  const dateAndTime = new Date();

  const userData = await getUserByUserId(userId);
  const userName = `${userData.firstName} ${userData.lastName}`;

  const participantData = await getUserByUserId(participantId);
  const participantName = `${participantData.firstName} ${participantData.lastName}`;

  let data = `UserId: ${userId}(${userName}) updated payment verification as "${isVerified}" of participant: ${participantId}(${participantName}); Date: ${dateAndTime}`;
  data += "\n";

  fs.appendFile("./logs/verification.txt", data, (error) => {
    console.log("Log Payment Update Verification Error:", error);
  });
}

module.exports = { logPaymentUpdateVerification };
