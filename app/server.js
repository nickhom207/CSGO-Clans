const pg = require("pg");
const express = require("express");
let axios = require("axios");
const app = express();

const port = 3000;
const hostname = "localhost";

app.use(express.static("public"));

const env = require("../env.json");

let apiKey = env["api_key"];
let baseUrl = env["api_url"];

const Pool = pg.Pool;
const pool = new Pool(env);
pool.connect().then(function () {
    console.log(`Connected to database ${env.database}`);
});

app.use(express.static("public"));

app.use(express.text());


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

app.get("/user_clan", (req, res) => {
    if(req.query.userID) {
        // let genre = req.query.genre;
        res.status(200);
        pool.query(
            `SELECT * FROM users WHERE id = $1`,
            [req.query.userID]
        ).then((result) => {
            // row was successfully inserted into table
            res.json({"rows": result.rows});
            console.log("Inserted:");
            console.log(result.rows);
        }
        )
        .catch((error) => {
            // something went wrong when inserting the row
            res.sendStatus(500);
            res.json({"error": "Invalid species"});
            console.log(error);
        });
    }
    // else{
    //     res.status(200);
    //     pool.query(
    //         `SELECT * FROM books`
    //     ).then((result) => {
    //         // row was successfully inserted into table
    //         res.json({"rows": result.rows});
    //         console.log("Inserted:");
    //         console.log(result.rows);
    //     })
        
    // }
});

app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});