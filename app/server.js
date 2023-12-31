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

const env = require("../env.json");

const session = require("express-session");
const cookieParser = require("cookie-parser");

app.use(express.text());
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: "key",
    resave: false,
    saveUninitialized: false,
	cookie: {
		maxAge: 3600000
	}
}));

app.use(passport.initialize());
app.use(passport.session());

let apiKey = env["api_key"];

const Pool = pg.Pool;
const pool = new Pool(env);
pool.connect().then(function () {
    console.log(`Connected to database ${env.database}`);
});

app.use(express.text());
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

let tokens = {};

function getToken(obj) {
    return obj["connect.sid"].substring(2).split(".")[0];
}

app.post("/login-page", (req, res) => {
    let steamid = req.body.id;
    req.login(steamid, function(err){
        if (tokens[req.session.id] === undefined) {
            tokens[req.session.id] = steamid;
        }
        console.log(tokens);
        
        if(err) return next(err);
        return res.sendStatus(200);
    });
});


app.post("/create-clan", (req, res) => {
    let {name, desc, unique_id, public} = req.body;
    let token = getToken(req.cookies);

    if (name === "" || name === null) {
        return res.sendStatus(400);
    }

    if (desc.length > 100) {
        return res.sendStatus(400);
    }

    if (unique_id.length !== 7) {
        return res.sendStatus(400);
    }

    if (public !== true && public !== false) {
        return res.sendStatus(400);
    }

    if (token === undefined || tokens[token] === undefined) {
        return res.sendStatus(400);
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

app.get("/user-info", (req, res) => {
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

app.get("/clan-info", (req, res) => {
    if (!req.query.unique_id) {
        return res.sendStatus(400);
    }
    if(req.query.unique_id) {
        res.status(200);
        pool.query(
            `SELECT * FROM clans WHERE unique_id = $1`,
            [req.query.unique_id]
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
        return res.json({"error": "Invalid clanName"});
    }
});

app.get("/all-public-clan-info", (req, res) => {
    res.status(200);
    pool.query(
        `SELECT * FROM clans where public = true`
    ).then((result) => {
        // row was successfully inserted into table
        return res.json({"rows": result.rows});
    })
    .catch((error) => {
        // something went wrong when inserting the row
        res.sendStatus(500);
        return res.json({"error": "Unknown error occurred."});
    });
});

app.get("/user-name-info", (req, res) => {
    if (!req.query.steamID) {
        return res.sendStatus(400);
    }

    if(req.query.steamID) {
        res.status(200);
        pool.query(
            `SELECT username FROM users WHERE steamid = $1`,
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

app.get("/user-clan", ensureAuthenticated, (req, res) => {
    if (!req.session.id) {
        return res.sendStatus(400);
    }
    let token = req.session.id;
    if (!tokens[token]) {
        return res.sendStatus(400);
    }

    let steamid = tokens[token];
    return res.render("pages/userClan.ejs", {"steamid": steamid});
});

app.get("/user-profile", ensureAuthenticated, (req,res) => {
    if (!req.session.id) {
        return res.sendStatus(400);
    }
    let token = req.session.id;
    if (!tokens[token]) {
        return res.sendStatus(400);
    }

    let steamid = tokens[token];
    return res.render("pages/userProfile.ejs", {"steamid": steamid});
});

let playNow = {};
let timeOutIds = {};

app.post("/play-now", ensureAuthenticated, (req, res) => {
    let {unique_id} = req.body;
    if (req.session.id == null) {
        return;
    }
    let token = req.session.id;
    let username = "";
    if (unique_id === null | unique_id === undefined) {
        return;
    }

    if (unique_id !== null && unique_id !== "" && unique_id.length === 7) {
        pool.query(
            `SELECT member_ids FROM clans WHERE unique_id = $1`,
            [unique_id]
        ).then((result) => {
            if (result.rows.length > 0 && result.rows[0]["member_ids"].includes(tokens[token])) {
                pool.query(
                    `SELECT username FROM users WHERE steamid = $1`,
                    [tokens[token]]
                ).then((result) => {
                    if (result.rows.length > 0) {
                        username = result.rows[0].username;
                        if (!playNow[unique_id]) {
                            let timerid = setTimeout(() => {
                                io.in(timeOutIds[timerid]).emit("play-cancel", playNow[unique_id]["players"].length);
                                delete playNow[unique_id];
                                delete timeOutIds[timerid];
                            },30000);
                            timeOutIds[timerid] = unique_id;
                            let entry = {"players" : [username]};
                            playNow[unique_id] = entry;
                        }
                        else {
                            if (!playNow[unique_id]["players"].includes(username)) {
                                playNow[unique_id]["players"].push(username)
                            }
                        }
                        io.in(unique_id).emit("play-now", playNow[unique_id]);
                        if (playNow[unique_id]["players"].length == 5) {
                            io.in(unique_id).emit("players-found", playNow[unique_id]);
                        }
                    }
                });
            }
        });

    }
});

app.get("/clan-pages", ensureAuthenticated, (req, res) => {
    let unique_id = req.query["unique_id"];
    if (req.session.id == null) {
        return res.sendStatus(400);
    }
    let token = req.session.id;
    let username = "";
    if (unique_id === null | unique_id === undefined) {
        return res.sendStatus(400);
    }  
    
    pool.query(
        `SELECT * FROM clans WHERE unique_id = $1`,
        [unique_id]
    ).then((result) => {
        if (result.rows.length == 0) {
            return res.sendStatus(400);
        }
        
        if (unique_id !== null && unique_id !== "" && unique_id.length === 7) {
            pool.query(
                `SELECT username FROM users WHERE steamid = $1`,
                [tokens[token]]
            ).then((result) => {
                if (result.rows.length > 0) {
                    username = result.rows[0].username;
                    return res.render("pages/chat.ejs", {"clanid": unique_id, "user" : username, "id" : tokens[token]});
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
        pool.query(
            `SELECT clan_chat FROM clans WHERE unique_id = $1`,
            [clan_id]
        ).then((result) => {
            if (result.rows[0]) {
                for (const element of result.rows[0]["clan_chat"]) {
                    io.sockets.to(socket.id).emit("previousMessages", {"message" : element.message, "user" : element.user, "clan_id" : element.clan_id, "user_id" : element.user_id});  
                }
            }
        });
    });
    socket.on("sendMessage", function(msg) {
        pool.query(
            `SELECT member_ids FROM clans WHERE unique_id = $1`,
            [msg.clan_id]
        ).then((result) => {
            if (result.rows.length > 0 && result.rows[0]["member_ids"].includes(msg["user_id"])) {
                socket.broadcast.to(msg.clan_id).emit("recieveMessage", {"message" : msg.message, "user" : msg.user, "clan_id" : msg.clan_id});
                pool.query(`UPDATE clans
                SET clan_chat = ARRAY_APPEND(clan_chat, $1) 
                WHERE unique_id = $2;`,
                [msg,msg.clan_id]);
            }
        });
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

app.get('/user', (req, res) => {
	res.send(req.user);
});

app.get("/logout", (req, res) => {
    console.log(tokens[req.session.id]);
    if (tokens[req.session.id] != null) {
        delete tokens[req.session.id];
    }
  req.logout(req.user, err => {
    if(err)
		return next(err);
    res.redirect("/");
  });
});

app.get('/api/auth/steam', passport.authenticate('steam', {failureRedirect: '/'}), function (req, res) {
	res.redirect('/user-profile')
});

app.get('/api/auth/steam/return', passport.authenticate('steam', {failureRedirect: '/'}), function (req, res) {
    if (tokens[req.session.id] === undefined) {
        tokens[req.session.id] = req.user.id;
    }
    console.log(tokens);
	
	//insert logged in user into database
	pool.query(`INSERT INTO users (steamid, username, region, calendar, steamlink, profilepic, clans) 
		VALUES($1, $2, $3, $4, $5, $6, $7)
		ON CONFLICT(steamid) DO NOTHING`,
        [req.user.id, req.user.displayName, 'Not set', '{"events":[]}', req.user.identifier, req.user._json.avatarfull, '{}']
    );
	
    res.redirect('/user-profile');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

const path = require('path');
app.get('/dashboard', ensureAuthenticated, (req, res) => {
	res.sendFile(path.join(__dirname, '/private/dashboard/index.html'));
});

app.get('/userInfo', ensureAuthenticated, (req, res) => {
	res.sendFile(path.join(__dirname, '/private/userInfo/index.html'));
});

app.post("/edit-user", (req, res) => {
    let {name, desc, unique_id, public} = req.body;
    let token = getToken(req.cookies);

    if (token === undefined || tokens[token] === undefined) {
        return res.sendStatus(400);
    }

    let userid = tokens[token];

    pool.query(`UPDATE users
        SET region = $2 
        WHERE steamid = $1;`,
        [userid, req.body.region]
    );
    res.sendStatus(200);
});

app.get("/internal-user-info", (req, res) => {
    let userid = req.query.id;
	console.log("Requested info from: " + userid);
	
    pool.query(
		`SELECT * FROM users WHERE steamid = $1`,
		[userid]
	).then((result) => {
		return res.json({result: result.rows});
	})
	.catch((error) => {
		res.sendStatus(500);
		return res.json({"error": "Error finding user"});
	});
});

server.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});