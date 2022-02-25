const express = require('express');
const app = express();
const port = 3000;
//const MongoClient = require('mongodb').MongoClient;


// Setup app
app.use(express.static(__dirname + '/public'));
app.listen(port, () => {
	console.log("Listening...");
});


// Home page
app.get('/', (request, response) => {
	response.sendFile(__dirname + "/public/home.html");
});