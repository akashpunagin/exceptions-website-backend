INSERT INTO event_master(event_name, event_description, event_max_points, event_max_team_size, event_is_open_event)
VALUES
    ('Gaming', 'Nice event', 100, 2, true),
    ('Solvathon', 'Nice event', 120, 3, true),
    ('IOT', 'Nice event', 150, 4, true),
    ('event1', 'Nice event', 150, 4, false),
    ('event2', 'Nice event', 150, 4, false),
    ('event3', 'Nice event', 150, 4, false);

INSERT INTO app_int_constants(label, value)
VALUES
    ('max_gc_member_size', 7),
    ('max_non_gc_member_size', 3);