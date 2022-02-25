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
// Adds an item to a list
async function AddShisha(username, info) {
	// Make sure info call is correct
	if (info['Brand'] == null || info['Flavor'] == null || info['List'] == null || info['Rating'] == null) { return; }
	const client = await MongoClient.connect("mongodb://localhost:27017/").catch(err => { console.log(err) });
	if (!client) {
		return;
	}
	try {
		let myList = {};
		myList[info['List']] = info;
		let res = await client.db("shisha-saver").collection("users").updateOne({ "username": username }, { $push: myList });
		console.log(res);
	} catch (error) {
		console.log(error);
	} finally {
		client.close();
	}
}

// Exports
module.exports.GetShisha = GetShisha;
module.exports.AddShisha = AddShisha;