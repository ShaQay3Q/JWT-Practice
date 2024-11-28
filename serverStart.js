const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
app.set("view-engine", "ejs");
app.use(express.static("public")); //better and newer way of applying css
app.use(express.urlencoded({ extended: false }));

const users = [];

app.get("/", (req, res) => {
	// send a certain page
	res.render("index.ejs", { name: "Sha", test: "TEST" });
});
app.get("/login", (req, res) => {
	res.render("login.ejs");
});

app.post("/register", async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		const user = {
			id: Date.now().toString(),
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword,
		};
		users.push(user);
		// res.status(201).send("Successful");
		res.redirect("/login");
	} catch {
		// res.status(500).send("Internal Server Error");
		res.redirect("/register");
	}
	console.log(users);
});

app.get("/register", (req, res) => {
	res.render("register.ejs");
});

app.post("/register", (req, res) => {});

app.listen(3001);
