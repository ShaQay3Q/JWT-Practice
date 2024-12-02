// Load in all the environmental variables and set them inside process.env
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
// require("dotenv").config();

const express = require("express");
// const z = require("zod");
// validationResault is a middleware
// Middleware order: The validation middleware must be placed before the actual route logic.
// means before app = express()
const { body, validationResult } = require("express-validator"); // For input validation

const app = express();
const bcrypt = require("bcrypt");
const methodOverride = require("method-override");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
// const initializePassport = require("initialize");
const initializePassport = require("./passport-config");

initializePassport(
	passport,
	(email) => users.find((user) => user.email === email),
	(id) => users.find((user) => user.id === id)
);

// ! OR

// function getUserByEmail(email) {
// 	return users.find((user) => user.email === email);
// }

// function getUserById(id) {
// 	return users.find((user) => user.id === id);
// }
// initializePassport(passport, getUserByEmail, getUserById);

app.set("view engine", "ejs");
app.use(express.static("public")); //!better and newer way of applying css
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(flash());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		// resaves session varibales if nothing has changed
		resave: false,
		// saves an empty value in the session if there is no value
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());
const users = [];

app.get("/", checkAuthenticated, (req, res) => {
	const userName = "";
	// send a certain page
	res.render("index.ejs", { name: (req.user && req.user.name) || userName });
});

// app.delete("/logout", (req, res) => {
// 	// Passport sets it authomatically
// 	// Clear session and log the user out
// 	// we can do that thrug HTML, ,it is not supported => intall method-override (delete)
// 	req.logOut();
// 	res.redirect("/login");
// });

app.delete("/logout", (req, res, next) => {
	// Explicitly ensure compatibility
	if (typeof req.logout === "function") {
		req.logout((err) => {
			if (err) {
				return next(err);
			}
			res.redirect("/login");
		});
	} else {
		// If req.logout() is not a function, handle manually
		req.session.destroy((err) => {
			if (err) {
				return next(err);
			}
			res.clearCookie("connect.sid"); // Clear session cookie
			res.redirect("/login");
		});
	}
});

app.get("/login", checkNotAuthenticated, (req, res) => {
	res.render("login.ejs");
});

app.post(
	"/login",
	checkNotAuthenticated,
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login",
		// show message to user (pre set messages)
		failureFlash: true,
	})
);

app.get("/register", checkNotAuthenticated, (req, res) => {
	res.render("register.ejs");
});

// const createValidator = [
// 	body("name").notEmpty().withMessage("Name is require"),
// 	body("email").isEmail().withMessage("Valid email is require"),
// 	body("password", "The minimum password length is 6 characters").isLength({
// 		min: 6,
// 	}),
// 	// .withMessage("Password must be at least 8 charachters"),
// ];

// const RegisterSchema = z.object({
// 	name: z.string().notEmpty(),
// 	email: z.string().email(),
// 	password: z.string().min(6, "Password needs to be at least 6 characters"),
// });

app.post(
	"/register",
	checkNotAuthenticated,
	// input validation - make sure only valid data be fetched
	// [
	// 	body("name").notEmpty().withMessage("Name is require"),
	// 	body("email").isEmail().withMessage("Valid email is require"),
	// 	body("password", "The minimum password length is 6 characters").isLength({
	// 		min: 6,
	// 	}),
	// 	// .withMessage("Password must be at least 8 charachters"),
	// ],
	async (req, res) => {
		// check for validity of the request
		const errors = validationResult(req);
		// if there are errors:
		if (!errors.isEmpty()) {
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
			console.error("Error registering user:", errors); // Log errors properly
			res.redirect("/register");
		}
	}
);

// Middleware function
function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	return res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect("/");
	}
	// continue with the call
	return next();
}

app.listen(3002);
