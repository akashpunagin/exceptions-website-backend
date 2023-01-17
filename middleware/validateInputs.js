const missingCredsMessage = "Missing Credentials";
const invalidCredsMessage = "Invalid Credentials";
const invalidEmailMessage = "Invalid Email";

function isValidEmail(userEmail) {
  const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
    userEmail
  );
  return isValidEmail;
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
}

function handelEventReq(req) {
  const { eventId, name, description, maxPoints, maxTeamSize, isOpenEvent } =
    req.body;

  if (req.path === "/add") {
    if (
      ![name, description, maxPoints, maxTeamSize, isOpenEvent].every(Boolean)
    ) {
      return missingCredsMessage;
    }
    if (typeof isOpenEvent !== "boolean") {
      return invalidCredsMessage;
    }
  }

  if (req.path === "/delete") {
    if (![eventId].every(Boolean)) {
      return missingCredsMessage;
    }
  }

  if (req.path === "/update") {
    if (
      ![eventId, name, description, maxPoints, maxTeamSize, isOpenEvent].every(
        Boolean
      )
    ) {
      return missingCredsMessage;
    }
    if (typeof isOpenEvent !== "boolean") {
      return invalidCredsMessage;
    }
  }
}

function handleTeamReq(req) {
  const { teamId, name, isGCConsidered } = req.body;

  if (req.path === "/add") {
    if (![name, isGCConsidered].every(Boolean)) {
      return missingCredsMessage;
    }
    if (typeof isGCConsidered !== "boolean") {
      return invalidCredsMessage;
    }
  }

  if (req.path === "/delete") {
    if (![teamId].every(Boolean)) {
      return missingCredsMessage;
    }
  }

  if (req.path === "/update") {
    if (![teamId, name, isGCConsidered].every(Boolean)) {
      return missingCredsMessage;
    }
  }
}

function handleTeamMemberError(req) {
  const { eventId, firstName, lastName, usn, email, contactNumber } = req.body;

  if (req.path === "/add") {
    if (
      ![eventId, firstName, lastName, usn, email, contactNumber].every(Boolean)
    ) {
      return missingCredsMessage;
    }
  }

  if (req.path === "/delete") {
    if (
      ![eventId, firstName, lastName, usn, email, contactNumber].every(Boolean)
    ) {
      return missingCredsMessage;
    }
  }
}

module.exports = (req, res, next) => {
  const authError = handleAuthReq(req);
  const eventError = handelEventReq(req);
  const teamError = handleTeamReq(req);
  const teamMemberError = handleTeamMemberError(req);

  console.log({
    authError,
    eventError,
    teamError,
    teamMemberError,
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

  next();
};
