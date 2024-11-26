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

app.post("/login", (req, res) => {
	// Authenticate User
	const username = req.body.username;
	const user = { name: username };

	// Create JWT
	// serialize user
	const accessToken = generteAccessToken(user); // erpires in given time: 15s
	// create Refresh Token
	const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

	res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generteAccessToken(user) {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20s" });
}

app.listen(4000);
