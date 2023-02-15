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

--EXECUTE CREATE EVENTS SQL HERE--