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

// This method starts the server and listens for incoming HTTP requests on the specified port.
// http://localhost:3000
app.listen(3000);
app.use(express.json());

const posts = [
	{
		username: "Sha",
		title: "Burp",
		body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare nibh ex, fringilla faucibus arcu egestas a. Proin ut finibus turpis. Mauris eu mi scelerisque mauris sagittis consequat a imperdiet nibh. Duis fringilla enim enim, eu egestas mi sagittis eu. Donec sed metus rutrum, imperdiet tortor eget, tempus arcu. Nulla sit amet urna tortor. Duis sem tortor, ultrices tristique ante id, eleifend semper nisl. Ut mattis eleifend lacus vel efficitur. Mauris malesuada tempor nulla et ultrices. Praesent justo velit, molestie et turpis vel, imperdiet vehicula dolor. Curabitur odio ex, finibus sed velit ut, aliquet tristique nisl. Curabitur et nulla a est pulvinar hendrerit eu eu lorem. Cras ut ornare tortor. Ut varius tincidunt enim. Phasellus eu ligula ut leo suscipit interdum.
        
        Proin interdum, lectus posuere efficitur efficitur, mauris mauris hendrerit felis, eget placerat felis enim venenatis lectus. Pellentesque tempus fringilla nisl vitae ultrices. Phasellus posuere massa eget ipsum faucibus, tincidunt dictum augue pretium. In fermentum facilisis cursus. Duis malesuada eros tempor nulla luctus, ut efficitur tellus dictum. Nullam varius nulla nec fringilla facilisis. Etiam pellentesque ante at dictum aliquet. Suspendisse potenti. Cras eleifend ornare elementum. Mauris lorem dolor, laoreet quis pellentesque sit amet, mollis et nisl. Sed a rhoncus neque. Quisque fermentum quis quam id malesuada. Maecenas laoreet pellentesque dictum. Nullam scelerisque at sem quis auctor. In ipsum eros, imperdiet quis erat vitae, sodales tempor magna. `,
	},
	{
		username: "Lean",
		title: "Fart",
		body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ac lacus a nunc porta mollis vel in mi. Sed at scelerisque felis. In ultrices, nibh nec porttitor pulvinar, nibh turpis fringilla lacus, et consequat ex lorem eu quam. Aenean hendrerit lectus id nisl bibendum, sit amet tincidunt leo rhoncus. Nunc facilisis venenatis eros. Pellentesque tempus arcu mauris, vel vestibulum neque ultricies ut. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In tristique velit finibus, aliquam magna a, efficitur justo.
        
        Donec aliquam congue finibus. Morbi tristique leo vitae augue tincidunt dictum. Pellentesque eleifend, risus nec faucibus finibus, magna ante posuere lacus, eget lacinia lacus ligula vitae felis. Quisque sit amet leo eu leo auctor venenatis dapibus eget magna. Aliquam velit nisl, feugiat quis urna eget, sagittis suscipit arcu. Pellentesque erat ex, condimentum at ligula nec, ullamcorper tincidunt nunc. Curabitur lorem felis, placerat ac purus in, ultrices vehicula libero. Praesent tempor metus sit amet erat eleifend, et vestibulum quam molestie. Quisque urna leo, feugiat sed enim non, tristique aliquam diam. `,
	},
];

app.get("/posts", authenticateTocken, (req, res) => {
	res.json(posts.filter(post => post.username = req.user.name));
});

app.post("/login", (req, res) => {
	// Authenticate User
	const username = req.body.username;
	const user = { name: username };

	// Create JWT
	// serialize user
	const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
	res.json({ accessToken: accessToken });
});

function authenticateTocken(req, res, next) {
	// Tocken comse from the header, here Bearer
	const authHeader = req.headers["authorization"];

	// gets the TOKEN after the Bearer: Bearer TOCKEN
	const token = authHeader && authHeader.split(" ")[1]; // undefined or TOKEN
	if (token === null) return res.sendStatuts(401); // token not found

	// Verify the token => pass the token and the secret
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) res.sendStatuts(403); // no valid token
		req.user = user;
		next();
	});
}
