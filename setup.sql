DROP DATABASE IF EXISTS csgo;

CREATE DATABASE csgo;
\c csgo

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	steamid text,
	username text,
	region text,
    calendar json,
    clans text[],
    token text
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
INSERT INTO users (id, steamid, username, region, calendar, clans) VALUES ('1000', '76561198025039300', 'Kenny', 'PA', '{"events":[]}', '{2000, 2001, 2002, 2003, 2004}');
INSERT INTO users (id, steamid, username, region, calendar, clans) VALUES ('1001', '76561198025039301', 'IronMan', 'PA', '{"events":[]}', '{2000, 2001, 2002, 2003, 2004}');


-- Dummy data for clans table:
INSERT INTO clans (id, clan_name, clan_description, clan_chat, member_ids, unique_id) VALUES ('2000', 'The A Team', 'We are the A Team', '{"messages":[]}', '{1000, 1001}', 'A-TEAM');
INSERT INTO clans (id, clan_name, clan_description, clan_chat, member_ids, unique_id) VALUES ('2001', 'The B Team', 'We are the B Team', '{"messages":[]}', '{1000, 1001}', 'B-TEAM');
INSERT INTO clans (id, clan_name, clan_description, clan_chat, member_ids, unique_id) VALUES ('2002', 'The C Team', 'We are the C Team', '{"messages":[]}', '{1000, 1001}', 'C-TEAM');
INSERT INTO clans (id, clan_name, clan_description, clan_chat, member_ids, unique_id) VALUES ('2003', 'The D Team', 'We are the D Team', '{"messages":[]}', '{1000, 1001}', 'D-TEAM');
INSERT INTO clans (id, clan_name, clan_description, clan_chat, member_ids, unique_id) VALUES ('2004', 'The E Team', 'We are the E Team', '{"messages":[]}', '{1000, 1001}', 'E-TEAM');
```
