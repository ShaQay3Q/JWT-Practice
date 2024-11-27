// imports the Express library
const express = require("express");

// initializes a new Express application instance
const app = express();

// allow app to accept json
app.use(express.json());

// in real app this will be stored in db
const users = [];

// exposes user's password and info - in real app this route won't be accessable
app.get("/users", (req, res) => {
	res.json(users);
});

app.post("/users", (req, res) => {
	const user = { name: req.body.name, password: req.body.password };
	users.push(user);
	res.status(201).send("Successful");
});

app.listen(5000)