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