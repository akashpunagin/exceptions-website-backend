-- Verify Transaction id from sheets, screenshot, database
-- Verify Name
-- Verify Amount paid in screenshot, sheet and database
-- 


SELECT *
FROM users
WHERE user_id = (
    SELECT team_head_user
    FROM team_master
    WHERE team_name_id = (
        SELECT id
        FROM team_names
        WHERE label = 'The Clone Troopers'
    )
);


SELECT *
FROM participant_payment, users
WHERE
    users.user_id = participant_payment.participant_id AND
    participant_payment.participant_id = (
        SELECT team_head_user
        FROM team_master
        WHERE team_name_id = (
            SELECT id
            FROM team_names
            WHERE label = 'The Clone Troopers'
        )
    );