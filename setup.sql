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
    unique_id varchar(7)
);