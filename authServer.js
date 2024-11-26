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

// app.post("/token", (req, res) => {
// 	const refreshToken = req.body.token;
// 	if (refreshToken === null) {
// 		return res.sendStatus(401);
// 	}
// 	if (!refreshTokens.includes(refreshToken)) {
// 		return res.sendStatus(403); // invalid refresh token
// 	}
// 	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
// 		if (err) {
// 			return res.sendStatus(403); // no valid token
// 		}
// 		const accessToken = generteAccessToken({ name: user.name });
// 		res.json({ accessToken: accessToken });
// 	});
// });

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

app.listen(4000);
