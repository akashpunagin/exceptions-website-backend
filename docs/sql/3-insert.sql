INSERT INTO event_master(event_name, event_description, event_max_points, event_max_team_size, event_is_open_event)
VALUES
    ('EVENT one', 'Nice event', 100, 4, true),
    ('EVENT two', 'Nice event', 120, 3, false);

INSERT INTO app_int_constants(label, value)
VALUES
    ('max_gc_member_size', 7),
    ('max_non_gc_member_size', 3);