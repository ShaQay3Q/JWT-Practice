const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
app.set("view engine", "ejs");
app.use(express.static("public")); //better and newer way of applying css
app.use(express.urlencoded({ extended: false }));
const { body, validationResult } = require("express-validator"); // For input validation

const users = [];

app.get("/", (req, res) => {
	// send a certain page
	res.render("index.ejs", { name: "Sha", test: "TEST" });
});
app.get("/login", (req, res) => {
	res.render("login.ejs");
});

app.post("/login", (req, res) => {});

app.get("/register", (req, res) => {
	res.render("register.ejs");
});

app.post(
	"/register",
	// input validation - make sure only valid data be fetched
	[
		body("name").notEmpty().withMessage("Name is require"),
		body("email").isEmail().withMessage("Valid email is require"),
		body("password")
			.isLength({ min: 8 })
			.withMessage("Password must be at least 8 charachters"),
	],
	async (req, res) => {
		// check for validity of the request
		const errors = validationResult(req);
		// if there are errors:
		if (!errors.isEmpty) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const { name, email, password } = req.body;

			// Check if email is already registered
			const existUser = users.find((user) => user.email === email);
			if (existUser) {
				return res.status(409).send("Email is already in use");
			}
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			const user = {
				id: Date.now().toString(),
				name: name,
				email: email,
				password: hashedPassword,
			};
			users.push(user);
			// res.status(201).send("Successful");
			res.redirect("/login");
		} catch {
			console.error("Error registering user:", error); // Log errors properly
			res.redirect("/register");
		}
		console.log(users);
	}
);

app.listen(3002);
