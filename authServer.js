// server.js: main server file
require("dotenv").config();

// This imports the Express library, which is a popular web application framework for Node.js.
// Express simplifies building web servers and APIs by providing utilities and middleware for
// handling routes, requests, and responses.
const express = require("express");
const jwt = require("jsonwebtoken");

// This function initializes a new Express application instance.
// The app object is used to configure the server, define routes, and attach middleware.
const app = express();

// allow app to accept json
app.use(express.json());

// It should be stored in DB ir basically someplace else than here!
// Just for the purpose of demonstration, else it gets emptied everytime server restarts
let refreshTokens = [];

app.post("/token", (req, res) => {
	const refreshToken = req.body.token;
	if (refreshToken === null) {
		return res.sendStatus(401); // token not found
	}
	if (!refreshTokens.includes(refreshToken)) {
		return res.sendStatus(403);
	}
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err) {
			return res.sendStatus(403); // invalid refresh token
		}
		const accessToken = generteAccessToken({ name: user.name }); // if only "user" being passed, like in the other midleare,
		// then the "user" contain more info, therefore we go wit only user's name = > { name: user.name}
		res.json({ accessToken: accessToken });
	});
});

// Delete refresh tokens, usually from a DB (here refreshTokens array)
app.delete("/logout", (req, res) => {
	refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
	res.sendStatus(204); // successful (deleted)
});

app.post("/login", (req, res) => {
	// Authenticate User
	const username = req.body.username;
	const user = { name: username };

	// Create JWT
	// serialize user
	const accessToken = generteAccessToken(user); // erpires in given time: 15s
	// create Refresh Token
	const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
	refreshTokens.push(refreshToken);

	res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generteAccessToken(user) {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "50s" });
}

// // in real app this will be stored in db
// const users = [];

// // exposes user's password and info - in real app this route won't be accessable
// app.get("/users", (req, res) => {
// 	res.json(users);
// });

// app.post("/users", (req, res) => {
// 	const user = { name: req.body.name, password: req.body.password };
// 	users.push(user);
// 	res.status(201).send("Successful");
// });

app.listen(4000);
