--used to store details of events--
CREATE TABLE event_master(
    event_id SERIAL PRIMARY KEY,
    event_name VARCHAR NOT NULL,
    event_route VARCHAR NOT NULL,
    event_description VARCHAR NOT NULL,
    event_img VARCHAR NOT NULL,


    event_max_points INT NOT NULL,
    event_max_team_size INT NOT NULL,
    event_is_open_event BOOLEAN NOT NULL --open or group event--
);


CREATE TABLE event_master_rule(
    event_rule_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES event_master ON DELETE CASCADE ON UPDATE CASCADE,
    event_rule VARCHAR NOT NULL
);

CREATE TABLE event_master_requirement(
    event_requirement_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES event_master ON DELETE CASCADE ON UPDATE CASCADE,
    event_requirement VARCHAR NOT NULL
);

CREATE TABLE event_master_contact(
    event_contact_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES event_master ON DELETE CASCADE ON UPDATE CASCADE,
    event_contact_name VARCHAR NOT NULL,
    event_contact_email VARCHAR NOT NULL,
    event_contact_phone VARCHAR NOT NULL
);

CREATE TABLE event_master_details(
    event_master_details_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES event_master ON DELETE CASCADE ON UPDATE CASCADE,
    event_to VARCHAR NOT NULL,
    event_description VARCHAR NOT NULL,
    event_img VARCHAR NOT NULL,
    event_direction VARCHAR NOT NULL,
    event_color VARCHAR NOT NULL,
    event_text VARCHAR NOT NULL,
    event_type VARCHAR NOT NULL
);