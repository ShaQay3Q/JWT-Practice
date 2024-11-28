const express = require("express");
const app = express();
app.set("view-engine", "ejs");
app.use(express.static("public")); //better and newer way of applying css

app.get("/", (req, res) => {
	// send a certain page
	res.render("index.ejs", { name: "Sha", test: "TEST" });
});
app.get("/login", (req, res) => {
	res.render("login.ejs");
});
app.get("/register", (req, res) => {
	res.render("register.ejs");
});

app.post("/register", (req, res) => {});

app.listen(3001);
