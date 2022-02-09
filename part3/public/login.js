const express = require('express');
const session = require('express-session');
const path = require('path');

// Create the express server
const app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
// Set parameters
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
// Declare that the login route to the client using a GET request
app.get('/', function (request, response) {
	// Render  the login template
	response.sendFile(path.join(__dirname + '/login.html'));
});
// Declare the home route
app.post('/auth', function (request, response) {
	// Get input fields
	let username = request.body.username;
	let password = request.body.password;
	// Check that the fields aren't empty
	if (username && password) {
		// Check the db here
		if (username == 'test' && password == 'test') {
			// Authenticate  the user
			request.session.loggedin = true;
			request.session.username = username;
			// Redirect to home page
			response.redirect('/home');
		} else {
			response.send('Incorrect username or password');
		}
		response.end();
	} else {
		response.send('Username and password are both required');
		response.end();
	}
});
// Declare the home route
app.get('/home', function (request, response) {
	// if the user  is  logged in
	if (request.session.loggedin) {
		// Output username
		response.send('Welcome ' + request.session.username);
	} else {
		// Not logged in
		response.send('Please log in to view this page');
	}
	response.end();
});

app.listen(3000);