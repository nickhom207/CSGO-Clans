const pg = require("pg");
const express = require("express");
let axios = require("axios");
const app = express();

const port = 3000;
const hostname = "localhost";

app.use(express.static("public"));

const env = require("../env.json");

const session = require("express-session");

let apiKey = env["api_key"];
let baseUrl = env["api_url"];

const Pool = pg.Pool;
const pool = new Pool(env);
pool.connect().then(function () {
    console.log(`Connected to database ${env.database}`);
});

app.use(express.static("public"));

app.use(express.text());

app.use(session( {
    secret: "key",
    resave: false,
    saveUninitialized: false
}));

app.get("/", (req, res) => {
    req.session.isAuth = true;
    console.log(req.session);
    console.log(req.session.id);
    res.send("hi");
});


app.get("/create-clan", (req, res) => {
    let name = req.query.name;
    if (name === "" || name === null) {
        return res.sendStatus(400);
    }

    let desc = req.query.desc;
    if (desc.length > 100) {
        return res.sendStatus(400);
    }

    let unique_id = req.query.unique_id;
    if (unique_id.length !== 7) {
        return res.sendStatus(400);
    }

    let public = req.query.public;
    if (public !== "true" && public !== "false") {
        return res.sendStatus(400);
    }

    let userid = [""];
    pool.query(
        `INSERT INTO clans(clan_name, clan_description, clan_chat, member_ids, unique_id, public) 
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [name, desc, {}, userid, unique_id, public]
    );
    console.log("Created Clan");
    res.sendStatus(200);
});

app.get("/user-clan", (req, res) => {
    if(req.query.steamID) {
        // res.status(200);
        pool.query(
            `SELECT * FROM users WHERE steamid = $1`,
            [req.query.steamID]
        ).then((result) => {
            // row was successfully inserted into table
            return res.json({"rows": result.rows});
        })
        .catch((error) => {
            // something went wrong when inserting the row
            res.status(500);
            return res.json({"error": "The user has not joined a clan yet."});
        });
    }
    else{
        res.status(400);
        return res.json({"error": "Invalid steamID"});
    }
});

app.get("/user-clan-detail", (req, res) => {
    if(req.query.clanID) {
        res.status(200);
        pool.query(
            `SELECT clan_name FROM clans WHERE unique_id = $1`,
            [req.query.clanID]
        ).then((result) => {
            // row was successfully inserted into table
            return res.json({"rows": result.rows});
        })
        .catch((error) => {
            // something went wrong when inserting the row
            res.sendStatus(500);
            return res.json({"error": "Unknown error occurred."});
        });
    }
    else{
        res.status(400);
        return res.json({"error": "Invalid clanID"});
    }
});

app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});