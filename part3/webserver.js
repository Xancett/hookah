const express = require('express');
const app = express();
const port = 3000;
const Database = require('./database');


// Setup app
app.use(express.static(__dirname + '/public'));
app.use(express.json({ limit: '1mb' }));
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

// List request
app.post('/hookahapi', (request, response) => {
	// Check to ensure the request is proper
	if (request.body['inforequest'] == null) { response.close(); }
	Database.GetShisha('test', request.body.inforequest).then(res => {
		//console.log(request.body.inforequest);
		response.send(res);
	});
});

// Update request
app.post('/shishaupdate', (request, response) => {
	// Check to ensure the request is proper
	if (request.body['inforequest'] == null) { response.close(); }
	Database.AddShisha('test', request.body.inforequest.data[0]).then(res => {
		response.send(res);
	});
})