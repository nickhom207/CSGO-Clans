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


app.get("/", (req,res) => {

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