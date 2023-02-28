CREATE TABLE allowed_emails_coordinators(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL
);


INSERT INTO allowed_emails_coordinators(email)
VALUES ('prajwalk.mca21@rvce.edu.in');
INSERT INTO allowed_emails_coordinators(email)
VALUES ('rakshithr.mca21@rvce.edu.in');
INSERT INTO allowed_emails_coordinators(email)
VALUES ('indrabusanam.mca21@rvce.edu.in');
INSERT INTO allowed_emails_coordinators(email)
VALUES ('aishwaryakk.mca21@rvce.edu.in');
INSERT INTO allowed_emails_coordinators(email)
VALUES ('Sumanthcr.mca21@rvce.edu.in');
INSERT INTO allowed_emails_coordinators(email)
VALUES ('Krupasa.mca21@rvce.edu.in');
INSERT INTO allowed_emails_coordinators(email)
VALUES ('shireeshakb.mca21@rvce.edu.in');
INSERT INTO allowed_emails_coordinators(email)
VALUES ('thejasp.mca21@rvce.edu.in');
INSERT INTO allowed_emails_coordinators(email)
VALUES ('bhaktiprabhu.mca21@rvce.edu.in');
INSERT INTO allowed_emails_coordinators(email)
VALUES ('sohangowdac.mca21@rvce.edu.in');
INSERT INTO allowed_emails_coordinators(email)
VALUES ('ranjithkj.mca21@rvce.edu.in');
INSERT INTO allowed_emails_coordinators(email)
VALUES ('winiljr.mca21@rvce.edu.in');

CREATE TABLE allowed_emails_volunteers(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL
);

INSERT INTO allowed_emails_volunteers(email)
VALUES ('shashankt.mca21@rvce.edu.in');
INSERT INTO allowed_emails_volunteers(email)
VALUES ('shimpyk.mca21@rvce.edu.in');


CREATE TABLE allowed_emails_admin(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL
);

INSERT INTO allowed_emails_admin(email)
VALUES ('akash.punagin@gmail.com');