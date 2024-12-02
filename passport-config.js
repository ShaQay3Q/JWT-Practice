//  Import the passport-local strategy for handling username/password authentication.
const localStrategy = require("passport-local").Strategy;

const bcrypt = require("bcrypt");

// async function authenticateUser(email, password, done) {
// 	const user = getUserByEmail(email);
// 	if (user == null) {
// 		return done(
// 			// first prameter is error => no error, nothimg wentwrong on the server
// 			null, // No server error
// 			// return the user we found => none
// 			false, // No user found
// 			// message => error message
// 			{ message: "No user with that email" }
// 		);
// 	}
// 	try {
// 		if (await bcrypt.compare(password, user.password)) {
// 			return done(null, user);
// 		} else {
// 			return done(null, false, { message: "Password incorecct" });
// 		}
// 	} catch (e) {
// 		done(e);
// 	}
// }

// This related to Login Page
function initialize(passport, getUserByEmail, getUserById) {
	const authenticateUser = async (email, password, done) => {
		const user = getUserByEmail(email);
		if (user == null) {
			return done(
				// first prameter is error => no error, nothimg wentwrong on the server
				null, // No server error
				// return the user we found => none
				false, // No user found
				// message => error message
				{ message: "No user with that email" }
			);
		}
		try {
			if (await bcrypt.compare(password, user.password)) {
				return done(null, user);
			} else {
				return done(null, false, { message: "Password incorecct" });
			}
		} catch (e) {
			done(e);
		}
	};
	passport.use(
		new localStrategy(
			{ usernameField: "email" }, // Field name in request body
			authenticateUser // Function that verifies user credentials
		)
	);

	// serialize user to store inside of the Session
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	passport.deserializeUser((id, done) => {
		return done(null, getUserById(id));
	});
}

// export function initialize;
module.exports = initialize;
