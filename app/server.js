const pg = require("pg");
const express = require("express");
let axios = require("axios");
const passport = require('passport');
const passportSteam = require('passport-steam');
const SteamStrategy = passportSteam.Strategy;
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);

const port = 3000;
const hostname = "localhost";

app.set("socketio", io);
app.set('view engine', 'ejs');


app.use(express.static("public"));

const env = require("../env.json");

const session = require("express-session");
const cookieParser = require("cookie-parser");

let apiKey = env["api_key"];
let baseUrl = env["api_url"];

const Pool = pg.Pool;
const pool = new Pool(env);
pool.connect().then(function () {
    console.log(`Connected to database ${env.database}`);
});

app.use(express.static("public"));

app.use(express.text());
app.use(express.json());
app.use(cookieParser());

let tokens = {};

app.use(session({
    secret: "key",
    resave: false,
    saveUninitialized: false,
	cookie: {
		maxAge: 3600000
	}
}));

function getToken(obj) {
    return obj["connect.sid"].substring(2).split(".")[0];
}

app.post("/login-page", (req, res) => {
    let steamid = req.body.id;
    req.session.isAuth = true;  //TODO: Delete this once login system is finished
    if (tokens[req.session.id] === undefined) {
        tokens[req.session.id] = steamid;
    }
    console.log(tokens);
    res.sendStatus(200);
});


app.post("/create-clan", (req, res) => {
    let {name, desc, unique_id, public} = req.body;
    let token = getToken(req.cookies);

    if (name === "" || name === null) {
        return res.sendStatus(405);
    }

    if (desc.length > 100) {
        return res.sendStatus(404);
    }

    if (unique_id.length !== 7) {
        return res.sendStatus(403);
    }

    if (public !== true && public !== false) {
        return res.sendStatus(402);
    }

    if (token === undefined || tokens[token] === undefined) {
        return res.sendStatus(401);
    }

    let userid = tokens[token];


    pool.query(`UPDATE users
        SET clans = ARRAY_APPEND(clans, $1) 
        WHERE steamid = $2;`,
        [unique_id,userid]
    );

    pool.query(
        `INSERT INTO clans(clan_name, clan_description, clan_chat, member_ids, unique_id, public) 
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [name, desc, {}, [userid], unique_id, public]
    );
    res.sendStatus(200);
});

app.post("/join-clan", (req, res) => {
    let {unique_id} = req.body;
    let token = getToken(req.cookies);

    if (token === undefined || tokens[token] === undefined) {
        res.status(400);
        return res.send("Must login first");
    }

    let user_id = tokens[token];

    pool.query(`SELECT * FROM clans WHERE unique_id = $1`,
    [unique_id]
    ).then((result) => {
        if (result.rows.length == 0 ) {
            res.status(400);
            return res.send("Unique ID is not valid");
        }
        if (result.rows[0]["member_ids"].includes(user_id)) {
            console.log(result.rows[0]["member_ids"]);
            res.status(400);
            return res.send("Already A Member");
        }

        pool.query(`UPDATE clans
            SET member_ids = ARRAY_APPEND(member_ids, $1) 
            WHERE unique_id = $2;`,
            [user_id, unique_id]
        );

        pool.query(`UPDATE users
            SET clans = ARRAY_APPEND(clans, $1) 
            WHERE steamid = $2;`,
            [unique_id,user_id]
        );

        return res.sendStatus(200);
    });
});

app.get("/user-clan", (req, res) => {
    if(req.query.steamID) {
        res.status(200);
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

app.get("/test", (req, res) => {
    let clan_id = req.query["clan_id"];
    if (req.session.id == null) {
        return res.sendStatus(400);
    }
    let token = req.session.id;
    let username = "";
    
    pool.query(
        `SELECT * FROM clans WHERE unique_id = $1`,
        [clan_id]
    ).then((result) => {
        if (result.rows.length == 0) {
            return res.sendStatus(400);
        }
        
        if (clan_id !== null && clan_id !== "" && clan_id.length === 7 && req.session.isAuth) {
            pool.query(
                `SELECT username FROM users WHERE steamid = $1`,
                [tokens[token]]
            ).then((result) => {
                if (result.rows.length > 0) {
                    username = result.rows[0].username;
                    return res.render("pages/chat.ejs", {"clanid": clan_id, "user" : username});
                }
                else {
                    return res.sendStatus(500);
                }
            });
        }
        else {
            return res.sendStatus(404);
        }
    });
});

io.on("connection", (socket) => {
    console.log("connected");
    socket.emit("message", "test");
    socket.on("join", function(clan_id) {
        socket.join(clan_id);
    });
    socket.on("sendMessage", function(msg) {
        console.log(msg);
        socket.broadcast.to(msg.clan_id).emit("recieveMessage", {"message" : msg.message, "user" : msg.user, "clan_id" : msg.clan_id});
    });
});

//Steam openID authorization

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

passport.use(new SteamStrategy({
	returnURL: 'http://localhost:' + port + '/api/auth/steam/return',
	realm: 'http://localhost:' + port + '/',
	apiKey: apiKey
	}, function (identifier, profile, done) {
		process.nextTick(function () {
			profile.identifier = identifier;
			return done(null, profile);
		});
	}
));

app.use(passport.initialize());

app.use(passport.session());

app.get('/user', (req, res) => {
	res.send(req.user);
});

app.get("/logout", (req, res) => {
  req.logout(req.user, err => {
    if(err) return next(err);
    res.redirect("/login");
  });
});

app.get('/api/auth/steam', passport.authenticate('steam', {failureRedirect: '/login'}), function (req, res) {
	res.redirect('/dashboard')
});

app.get('/api/auth/steam/return', passport.authenticate('steam', {failureRedirect: '/login'}), function (req, res) {
	res.redirect('/dashboard')
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

server.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});