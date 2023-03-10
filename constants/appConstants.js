function deepFreeze(object) {
  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(object);

  // Freeze properties before freezing self

  for (const name of propNames) {
    const value = object[name];

    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
}

const constants = {
  SQL_TABLE: {
    users: "users",
    userVerificationTokens: "user_verification_tokens",
    userRole: "user_role",
    userPermission: "user_permission",

    participantDetails: "participant_details",
    participantPayment: "participant_payment",

    eventMaster: "event_master",
    eventMasterRule: "event_master_rule",
    eventMasterRequirement: "event_master_requirement",
    eventMasterContact: "event_master_contact",
    eventMasterDetails: "event_master_details",

    teamMaster: "team_master",

    teamEvents: "team_events", // used to map each team with selected events

    teamMemberMaster: "team_member_master", // used to store details of team members
    teamIdTeamMember: "team_id_team_member", // used to map team (team id) and team member (member id)
    teamIdTeamMemberEvent: "team_id_team_member_event", // used to map team (team id), team member (member id) and event (event id)

    appIntConstants: "app_int_constants",
    appVarcharConstants: "app_varchar_constants",

    teamNames: "team_names",

    allowedEmailsAdmin: "allowed_emails_admin",
    allowedEmailsCoordinators: "allowed_emails_coordinators",
    allowedEmailsVolunteers: "allowed_emails_volunteers",
  },
};

module.exports = deepFreeze(constants);
