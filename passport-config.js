import { Strategy } from "passport-local";

const localStrategy = require("passport-local").Strategy;
console.log(typeof localStrategy);

const bcrypt = require("bcrypt");

async function authenticateUser(email, password, done) {

	const user = getUserByEmail(email, );
	if (user == null) {
		return done(
			// first prameter is error => no error, nothimg wentwrong on the server
			null,
			// return the user we found => none
			false,
			// message => error message
			{ message: "No user with that email" }
		);
	}
	try {
		if (await bcrypt.compare(password, user.password)) {
            return done( null, user)
		} else {
            return done(null, false, { message: "Password incorecct"})
        }
	} catch (e) {
        done(e)
    }
}

export async function initialize(passport) {
	// const authenticateUser = () => {}
	passport.use(
		new localStrategy(
			{ usernameFiled: "email" },
			// pass the fuction to authenticate the user
			authenticateUser
		)
	);

	passport.serializeUser((user, done) => {});
	passport.deSerializeUser((id, done) => {});
}
