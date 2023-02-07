--set password for user--
ALTER USER postgres PASSWORD 'password';

CREATE DATABASE exceptions_event;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";