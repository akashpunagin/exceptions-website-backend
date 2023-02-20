const missingCredsMessage = "Missing Credentials";
const invalidCredsMessage = "Invalid Credentials";
const invalidEmailMessage = "Invalid Email";

function isValidEmail(userEmail) {
  const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
    userEmail
  );
  return isValidEmail;
}

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

function handleAuthReq(req) {
  const {
    userId,
    email,
    contactNumber,
    firstName,
    lastName,
    password,
    collegeName,
    usn,
    state,
    city,
    zip,
    newPassword,
  } = req.body;

  if (req.path === "/register-admin") {
    if (![email, firstName, lastName, contactNumber, password].every(Boolean)) {
      return missingCredsMessage;
    }

    if (!isValidEmail(email)) {
      return invalidEmailMessage;
    }
  }

  if (req.path === "/register-coordinator") {
    if (![email, contactNumber, firstName, lastName, password].every(Boolean)) {
      return missingCredsMessage;
    }
    if (!isValidEmail(email)) {
      return invalidEmailMessage;
    }
  }

  if (req.path === "/register-volunteer") {
    if (![email, contactNumber, firstName, lastName, password].every(Boolean)) {
      return missingCredsMessage;
    }
    if (!isValidEmail(email)) {
      return invalidEmailMessage;
    }
  }

  if (req.path === "/register-participant") {
    if (
      ![
        email,
        contactNumber,
        firstName,
        lastName,
        password,
        collegeName,
        usn,
        state,
        city,
        zip,
      ].every(Boolean)
    ) {
      return missingCredsMessage;
    }
    if (!isValidEmail(email)) {
      return invalidEmailMessage;
    }
  }

  if (req.path === "/delete-user") {
    if (![userId].every(Boolean)) {
      return missingCredsMessage;
    }
  }

  if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return missingCredsMessage;
    }
    if (!isValidEmail(email)) {
      return invalidEmailMessage;
    }
  }

  if (req.path === "/send-confirmation-email") {
    if (![userId].every(Boolean)) {
      return missingCredsMessage;
    }
  }

  if (req.path === "/update-password") {
    if (![newPassword].every(Boolean)) {
      return missingCredsMessage;
    }
  }
}

function handelEventReq(req) {
  const { eventId, name, description, maxPoints, maxTeamSize, isOpenEvent } =
    req.body;

  if (req.path === "/delete") {
    if (![eventId].every(Boolean)) {
      return missingCredsMessage;
    }
  }

  if (req.path === "/update") {
    if (![eventId, name, description, maxPoints, maxTeamSize].every(Boolean)) {
      return missingCredsMessage;
    }
    if (typeof isOpenEvent !== "boolean") {
      return invalidCredsMessage;
    }
  }

  if (req.path === "/get-team-members-by-event-id") {
    if (![eventId].every(Boolean)) {
      return missingCredsMessage;
    }
  }
}

function handleTeamReq(req) {
  const { teamId, teamNameId, isGCConsidered, openEventIds } = req.body;

  if (req.path === "/add") {
    if (![teamNameId, openEventIds].every(Boolean)) {
      return missingCredsMessage;
    }
    if (typeof isGCConsidered !== "boolean") {
      return invalidCredsMessage;
    }
    if (typeof teamNameId !== "number") {
      return invalidCredsMessage;
    }
  }

  if (req.path === "/delete") {
    if (![teamId].every(Boolean)) {
      return missingCredsMessage;
    }
  }

  if (req.path === "/update") {
    if (![teamNameId].every(Boolean)) {
      return missingCredsMessage;
    }
    if (typeof teamNameId !== "number") {
      return invalidCredsMessage;
    }
  }

  if (req.path === "/get-specific-team-details") {
    if (![teamId].every(Boolean)) {
      return missingCredsMessage;
    }
  }
}

function handleTeamMemberReq(req) {
  const {
    firstName,
    lastName,
    usn,
    email,
    contactNumber,
    eventId,
    memberId,
    isPresent,
  } = req.body;

  if (req.path === "/add") {
    if (![firstName, lastName, usn, email, contactNumber].every(Boolean)) {
      return missingCredsMessage;
    }
  }

  if (req.path === "/delete") {
    if (![memberId].every(Boolean)) {
      return missingCredsMessage;
    }
  }

  if (req.path === "/update") {
    if (
      ![memberId, firstName, lastName, usn, email, contactNumber].every(Boolean)
    ) {
      return missingCredsMessage;
    }
  }

  if (req.path === "/update-attendence") {
    if (![memberId].every(Boolean)) {
      return missingCredsMessage;
    }
    if (typeof isPresent !== "boolean") {
      return invalidCredsMessage;
    }
  }

  if (req.path === "/add-team-member-to-event") {
    if (![eventId, memberId].every(Boolean)) {
      return missingCredsMessage;
    }
  }

  if (req.path === "/remove-team-member-from-event") {
    if (![eventId, memberId].every(Boolean)) {
      return missingCredsMessage;
    }
  }

  if (req.path === "/get-by-eventId") {
    if (![eventId].every(Boolean)) {
      return missingCredsMessage;
    }
  }

  if (req.path === "/get-event-of-team-member") {
    if (![memberId].every(Boolean)) {
      return missingCredsMessage;
    }
  }
}

function handleAppConstantsReq(req) {
  const { memberSize } = req.body;

  if (req.path === "/update-max-gc-member-size") {
    if (![memberSize].every(Boolean)) {
      return missingCredsMessage;
    }
  }
}

function handleTeamNamesReq(req) {
  const { id, label } = req.body;

  if (req.path === "/add") {
    if (![label].every(Boolean)) {
      return missingCredsMessage;
    }
  }
  if (req.path === "/delete") {
    if (![id].every(Boolean)) {
      return missingCredsMessage;
    }
  }
}

function handlePaymentReq(req) {
  const { amount, transactionId, isVerified, participantId } = req.body;
  if (req.path === "/add") {
    if (![amount, transactionId].every(Boolean)) {
      return missingCredsMessage;
    }
    if (!isNumeric(amount)) {
      return invalidCredsMessage;
    }
  }

  if (req.path === "/update-verification") {
    if (typeof isVerified !== "boolean") {
      return invalidCredsMessage;
    }
  }

  if (req.path === "/get-screenshot-by-user-id") {
    if (![participantId].every(Boolean)) {
      return missingCredsMessage;
    }
  }

  if (req.path === "/delete-with-user-id") {
    if (![participantId].every(Boolean)) {
      return missingCredsMessage;
    }
  }
}

module.exports = (req, res, next) => {
  const authError = handleAuthReq(req);
  const eventError = handelEventReq(req);
  const teamError = handleTeamReq(req);
  const teamMemberError = handleTeamMemberReq(req);
  const appConstantsError = handleAppConstantsReq(req);
  const teamNamesError = handleTeamNamesReq(req);
  const paymentError = handlePaymentReq(req);

  console.log({
    authError,
    eventError,
    teamError,
    teamMemberError,
    appConstantsError,
    teamNamesError,
    paymentError,
  });

  if (req.originalUrl.includes("/auth/") && authError) {
    return res.status(401).json({ error: authError });
  }
  if (req.originalUrl.includes("/event/") && eventError) {
    return res.status(401).json({ error: eventError });
  }
  if (req.originalUrl.includes("/team/") && teamError) {
    return res.status(401).json({ error: teamError });
  }
  if (req.originalUrl.includes("/teamMember/") && teamMemberError) {
    return res.status(401).json({ error: teamMemberError });
  }
  if (req.originalUrl.includes("/appConstants/") && appConstantsError) {
    return res.status(401).json({ error: appConstantsError });
  }
  if (req.originalUrl.includes("/teamNames/") && teamNamesError) {
    return res.status(401).json({ error: teamNamesError });
  }
  if (req.originalUrl.includes("/payment/") && paymentError) {
    return res.status(401).json({ error: paymentError });
  }

  next();
};
