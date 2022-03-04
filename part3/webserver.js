const express = require('express');
const multer = require('multer');
const upload = multer();
const app = express();
const port = 3000;
const Database = require('./database');
const Auth = require('./Authentication');


// Setup app
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: '2mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(upload.array());
app.listen(port, () => {
	console.log("Listening...");
});


// Home page
app.get('/', (request, response) => {
	console.log("Get / requested");
	if (request.get('cookie') != "" && request.get('cookie') != undefined) {
		if (!Auth.Authenticated(request.get('cookie').replace("SecurityToken=", ""))) {
			console.log(request.get('cookie').replace("SecurityToken=", ""));
			response.redirect('/login');
		} else {
			console.log("Send home");
			response.sendFile(__dirname + "/public/home.html");
		}
	} else {
		response.redirect('/login');
	}
});

// Login page
app.get('/login', (request, response) => {
	console.log("Get /login requested");
	response.sendFile(__dirname + '/public/login.html');
});

// Account setup page
app.get('/accountsetup', (request, response) => {
	response.sendFile(__dirname + '/public/create.html');
});

// List request
app.post('/hookahapi', (request, response) => {
	// Check to ensure the request is proper
	if (request.body['inforequest'] == null) { response.close(); }
	if (request.get('SecurityToken') == null) { response.sendFile(__dirname + "/public/login.html"); }
	if (!Auth.Authenticated(request.get('SecurityToken'))) { response.sendFile(__dirname + "/public/login.html"); }
	Database.GetShisha(Auth.GetUsername(request.get('SecurityToken')), request.body.inforequest).then(res => {
		//console.log(request.body.inforequest);
		response.send(res);
	});
});

// Update request
app.post('/shishaupdate', (request, response) => {
	// Check to ensure the request is proper
	if (request.body['inforequest'] == null) { response.close(); }
	if (request.get('SecurityToken') == null) { response.sendFile(__dirname + "/public/login.html"); }
	if (!Auth.Authenticated(request.get('SecurityToken'))) { response.sendFile(__dirname + "/public/login.html");}
	Database.AddShisha(Auth.GetUsername(request.get('SecurityToken')), request.body.inforequest.data[0]).then(res => {
		response.send(res);
	});
})

// Request for security token
app.post('/shishalogintoken', (request, response) => {
	console.log("post /shishalogintoken requested");
	// Check if request has username and password
	if (request.body['username'] == null || request.body['password'] == null) {
		response.send({ "Bad Request": "Missing username or password" });
	}
	Auth.Login(request.body.username, request.body.password, Database).then(res => {
		if (res == null) {
			response.send({ "Error": "Username or password incorrect" });// Send null if we recieved null
		} else {
			response.send({ "SecurityToken": res });
		}
	})
});

// Request for creating an account
app.post('/createaccount', (request, response) => {
	// Check that username and password exist
	if (request.body['username'] == null || request.body['password'] == null) {
		response.send({ "Bad request": "Missing username or password" });
	}
	// Check to make sure user doesn't already exist in the DB
	Database.GetUserPassword(request.body.username).then(existance => {
		if (existance != null) {
			response.send({ "Error": "Username already exists" });
		} else {
			// First hash the password given
			Auth.HashPassword(request.body['password']).then(res => {
				// Pass in the hashed password to create the account
				Database.CreateAccount(request.body.username, res).then(res2 => {
					// Re-direct the user to the login page
					response.redirect('/login');
				});
			});
		}
	})
});