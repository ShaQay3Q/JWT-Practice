// imports the Express library
const express = require("express");

// For hashing
// const argon2 = require("argon2");
const bcrypt = require("bcrypt");

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

app.post("/users", async (req, res) => {
	try {
		// const newSalt = await argon2.genSalt(10);
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		console.log(salt);
		console.log(hashedPassword);

		const user = { name: req.body.name, password: hashedPassword };
		users.push(user);
		res.status(201).send("Successful");
		// hash("ThisIsAPassword");
	} catch (error) {
		console.log(error);

		res.status(500).send("Internal Server Error");
	}
});

app.listen(5000);
