DROP DATABASE IF EXISTS csgo;

CREATE DATABASE csgo;
\c csgo

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	steamid text,
	username text,
	region text,
    calendar json,
    clans text[]
);

CREATE TABLE clans (
	id SERIAL PRIMARY KEY,
	clan_name text,
	clan_description text,
	clan_chat json,
    member_ids text[],
    unique_id text,
    public boolean
);


-- Dummy data for users table:
INSERT INTO users (steamid, username, region, calendar, clans, token) VALUES ('76561198025039300', 'Kenny', 'PA', '{"events":[]}', '{}');
INSERT INTO users (steamid, username, region, calendar, clans, token) VALUES ('76561198025039301', 'IronMan', 'PA', '{"events":[]}', '{}');


-- Dummy data for clans table:
INSERT INTO clans (clan_name, clan_description, clan_chat, member_ids, unique_id, public) VALUES ('The A Team', 'We are the A Team', '{"messages":[]}', '{1000, 1001}', 'A-TEAM', 'true');
INSERT INTO clans (clan_name, clan_description, clan_chat, member_ids, unique_id, public) VALUES ('The B Team', 'We are the B Team', '{"messages":[]}', '{1000, 1001}', 'B-TEAM', 'false');
INSERT INTO clans (clan_name, clan_description, clan_chat, member_ids, unique_id, public) VALUES ('The C Team', 'We are the C Team', '{"messages":[]}', '{1000, 1001}', 'C-TEAM', 'true');
INSERT INTO clans (clan_name, clan_description, clan_chat, member_ids, unique_id, public) VALUES ('The D Team', 'We are the D Team', '{"messages":[]}', '{1000, 1001}', 'D-TEAM', 'true');
INSERT INTO clans (clan_name, clan_description, clan_chat, member_ids, unique_id, public) VALUES ('The E Team', 'We are the E Team', '{"messages":[]}', '{1000, 1001}', 'E-TEAM', 'false');