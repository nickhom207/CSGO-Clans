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
INSERT INTO users (steamid, username, region, calendar, clans) VALUES ('76561198025039300', 'Kenny', 'PA', '{"events":[]}', '{"7bd654a", "7bd654b", "7bd654c"}');
INSERT INTO users (steamid, username, region, calendar, clans) VALUES ('76561198025039301', 'IronMan', 'PA', '{"events":[]}', '{"7bd654d", "7bd654e"}');
INSERT INTO users (steamid, username, region, calendar, clans) VALUES ('76561198025039302', 'Batman', 'PA', '{"events":[]}', '{"7bd654a", "7bd654b", "7bd654c"}');
INSERT INTO users (steamid, username, region, calendar, clans) VALUES ('76561198025039303', 'Superman', 'PA', '{"events":[]}', '{"7bd654d", "7bd654e"}');
INSERT INTO users (steamid, username, region, calendar, clans) VALUES ('76561198025039304', 'Spiderman', 'PA', '{"events":[]}', '{"7bd654a", "7bd654b", "7bd654c"}');
INSERT INTO users (steamid, username, region, calendar, clans) VALUES ('76561198025039305', 'Hulk', 'PA', '{"events":[]}', '{"7bd654d", "7bd654e"}');


-- Dummy data for clans table:
INSERT INTO clans (clan_name, clan_description, clan_chat, member_ids, unique_id, public) VALUES ('The A Team', 'We are the A Team', '{"messages":[]}', '{"76561198025039300", "76561198025039302", "76561198025039304"}', '7bd654a', 'true');
INSERT INTO clans (clan_name, clan_description, clan_chat, member_ids, unique_id, public) VALUES ('The B Team', 'We are the B Team', '{"messages":[]}', '{"76561198025039300", "76561198025039302", "76561198025039304"}', '7bd654b', 'false');
INSERT INTO clans (clan_name, clan_description, clan_chat, member_ids, unique_id, public) VALUES ('The C Team', 'We are the C Team', '{"messages":[]}', '{"76561198025039300", "76561198025039302", "76561198025039304"}', '7bd654c', 'true');
INSERT INTO clans (clan_name, clan_description, clan_chat, member_ids, unique_id, public) VALUES ('The D Team', 'We are the D Team', '{"messages":[]}', '{"76561198025039301", "76561198025039303", "76561198025039305"}', '7bd654d', 'true');
INSERT INTO clans (clan_name, clan_description, clan_chat, member_ids, unique_id, public) VALUES ('The E Team', 'We are the E Team', '{"messages":[]}', '{"76561198025039301", "76561198025039303", "76561198025039305"}', '7bd654e', 'false');