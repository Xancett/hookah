const MongoClient = require('mongodb').MongoClient;

// Get all shisha from a list by username
async function GetShisha(username, list) {
	let requestedList = { "data": [] };
	const client = await MongoClient.connect("mongodb://localhost:27017/").catch(err => { console.log(err) });
	if (!client) {
		return;
	}
	try {
		let res = await client.db("shisha-saver").collection("users").findOne({ "username": username });
		requestedList['data'] = JSON.parse(JSON.stringify(res[list]));
		return requestedList;
	} catch (error) {
		console.log(error);
	} finally {
		client.close();
	}
}

// Exports
module.exports.GetShisha = GetShisha;