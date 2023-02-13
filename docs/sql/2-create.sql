CREATE TABLE users(
    -- indentification and verification
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,

    -- user details
    email VARCHAR UNIQUE NOT NULL,
    contact_number VARCHAR NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,

    -- user confidential information
    password VARCHAR(255) NOT NULL,
    refresh_token VARCHAR,

    -- created at
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- to store tokens while user email verification
CREATE TABLE user_verification_tokens(
    user_id uuid PRIMARY KEY REFERENCES users ON DELETE CASCADE ON UPDATE CASCADE,
    token VARCHAR NOT NULL
);

-- role of each users will be defined in this table
CREATE TABLE user_role(
    user_id uuid PRIMARY KEY REFERENCES users ON DELETE CASCADE ON UPDATE CASCADE,
    role_admin BOOLEAN DEFAULT FALSE,
    role_coordinator BOOLEAN DEFAULT FALSE,
    role_volunteer BOOLEAN DEFAULT FALSE,
    role_participant BOOLEAN DEFAULT FALSE
);

-- permissions of users will be defined here
CREATE TABLE user_permission(
    user_id uuid PRIMARY KEY REFERENCES users ON DELETE CASCADE ON UPDATE CASCADE,
    perm_add_event BOOLEAN DEFAULT FALSE,
    perm_edit_event BOOLEAN DEFAULT FALSE,
    perm_delete_event BOOLEAN DEFAULT FALSE,
    
    perm_view_participant BOOLEAN DEFAULT FALSE,
    perm_edit_participant BOOLEAN DEFAULT FALSE,
    
    perm_access_report BOOLEAN DEFAULT FALSE
);

--used to store other details of participants (participant is team head)--
CREATE TABLE participant_details(
    user_id uuid PRIMARY KEY REFERENCES users ON DELETE CASCADE ON UPDATE CASCADE,
    college_name VARCHAR NOT NULL,
    usn VARCHAR NOT NULL,
    state VARCHAR NOT NULL,
    city VARCHAR NOT NULL,
    zip INT NOT NULL
);

--used to store details of events--
CREATE TABLE event_master(
    event_id SERIAL PRIMARY KEY,
    event_name VARCHAR NOT NULL,
    event_description VARCHAR NOT NULL,
    event_max_points INT NOT NULL,
    event_max_team_size INT NOT NULL,
    event_is_open_event BOOLEAN NOT NULL --open or group event--
);

--used to store team names--
CREATE TABLE team_names(
    id SERIAL PRIMARY KEY,
    label VARCHAR NOT NULL UNIQUE
);

--used to store details of team along with team head--
CREATE TABLE team_master(
    team_id SERIAL PRIMARY KEY,
    team_name_id INTEGER REFERENCES team_names UNIQUE,
    team_head_user uuid REFERENCES users ON DELETE CASCADE ON UPDATE CASCADE,
    team_is_gc_considered BOOLEAN NOT NULL,
    team_score INT DEFAULT 0
);

--used to map each team with selected events--
CREATE TABLE team_events(
    team_id INT REFERENCES team_master ON DELETE CASCADE ON UPDATE CASCADE,
    event_id INT REFERENCES event_master ON DELETE CASCADE ON UPDATE CASCADE,

    PRIMARY KEY(team_id, event_id)
);

--team member master--
CREATE TABLE team_member_master(
    member_id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    usn VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    contact_number VARCHAR NOT NULL,
    is_present BOOLEAN DEFAULT FALSE
);

--used to map team and team members--
CREATE TABLE team_id_team_member(
    team_id_team_member_id SERIAL PRIMARY KEY,
    team_id INT REFERENCES team_master ON DELETE CASCADE ON UPDATE CASCADE,
    member_id INT REFERENCES team_member_master ON DELETE CASCADE ON UPDATE CASCADE,

    UNIQUE(team_id, member_id)
);

--used to map team, team members and team member's event--
CREATE TABLE team_id_team_member_event(
    team_id_team_member_id INT REFERENCES team_id_team_member ON DELETE CASCADE ON UPDATE CASCADE,
    event_id INT REFERENCES event_master ON DELETE CASCADE ON UPDATE CASCADE,

    PRIMARY KEY(team_id_team_member_id, event_id)
);

--used to store application constants--
CREATE TABLE app_int_constants(
    id SERIAL PRIMARY KEY,
    label VARCHAR NOT NULL,
    value INT NOT NULL
);