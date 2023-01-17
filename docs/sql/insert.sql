CREATE TABLE event_master(
    event_id SERIAL PRIMARY KEY,
    event_name VARCHAR NOT NULL,
    event_description VARCHAR NOT NULL,
    event_max_points INT NOT NULL,
    event_max_team_size INT NOT NULL
);

INSERT INTO event_master(event_name, event_description, event_max_points, event_max_team_size, event_is_open_event)
VALUES
    ("EVENT one", "Nice event", 100, 4, true),
    ("EVENT two", "Nice event", 120, 3, false),