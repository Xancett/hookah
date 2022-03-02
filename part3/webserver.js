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
	//Database.HardReset();
	//Database.UpdateList('test', {"Brand": "Fumari", "Flavor": "Mint", "List": "Enjoyed", "Rating": "4"});
	//Database.AddShisha('test', {"Brand": "Fumari", "Flavor": "Mint", "List": "Enjoyed", "Rating": "4"});
	//Database.GetShisha('test', 'Enjoyed').then(response => console.log(response));
	//Database.UpdateList('test', [{ "Brand": "Starbuzz", "Flavor": "Black Grape", "List": "Enjoyed", "Rating": "3" }, { "Brand": "Starbuzz", "Flavor": "Candy", "List": "Enjoyed", "Rating": "5" }, { "Brand": "Ugly Shisha", "Flavor": "Hurricane", "List": "Enjoyed", "Rating": "4" }, { "Brand": "Fumari", "Flavor": "Sour Cherry", "List": "Enjoyed", "Rating": "3" } ]);
	//Database.SeekAndDestroy('test', {"Brand": "Fumari", "Flavor": "Mint", "List": "Enjoyed", "Rating": "4"});
	response.sendFile(__dirname + "/public/home.html");
});

// Login page
app.get('/login', (request, response) => {
	response.sendFile(__dirname + '/public/login.html');
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
	// Check if request has username and password
	if (request.body['username'] == null || request.body['password'] == null) {
		response.send({ "Bad Request": "Missing username or password" });
	}
	Auth.Login(request.body.username, request.body.password, Database).then(res => {
		if (res == null) { response.send(res); } // Send null if we recieved null
		response.send({ "SecurityToken": res });
	})
});