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
	// Check if we can remove it from any list first
	await SeekAndDestroy(username, info);
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
// Finds and removes the flavor from the first list it is found in
async function SeekAndDestroy(username, info) {
	// Make sure call is correct
	if (info['Brand'] == null || info['Flavor'] == null || info['List'] == null || info['Rating'] == null) { return; }
	const client = await MongoClient.connect("mongodb://localhost:27017/").catch(err => { console.log(err) });
	if (!client) {
		return;
	}
	try {
		// Remove the list and ratings as they won't match what is currently in the DB
		qInfo = { "Brand": info.Brand, "Flavor": info.Flavor };
		// Try to remove from Enjoyed, Plan to smoke and Disliked
		let res = await client.db("shisha-saver").collection("users").updateOne({ "username": username }, { $pull: {"Enjoyed" : qInfo}});
		res = await client.db("shisha-saver").collection("users").updateOne({ "username": username }, { $pull: {"Plan to smoke" : qInfo}});
		res = await client.db("shisha-saver").collection("users").updateOne({ "username": username }, { $pull: {"Disliked" : qInfo}});
	} catch (error) {
		console.log(error);
	} finally {
		client.close();
	}
}

async function HardReset() {
		const client = await MongoClient.connect("mongodb://localhost:27017/").catch(err => { console.log(err) });
		if (!client) {
			return;
		}
		try {
			let myList = { "Enjoyed": [{ "Brand": "Starbuzz", "Flavor": "Black Grape", "List": "Enjoyed", "Rating": "3" }, { "Brand": "Starbuzz", "Flavor": "Candy", "List": "Enjoyed", "Rating": "5" }, { "Brand": "Ugly Shisha", "Flavor": "Hurricane", "List": "Enjoyed", "Rating": "4" }, { "Brand": "Fumari", "Flavor": "Sour Cherry", "List": "Enjoyed", "Rating": "3" }], "Plan to smoke": [{ "Brand": "Starbuzz", "Flavor": "Classic Mojito", "List": "Plan to smoke", "Rating": "0" }, { "Brand": "Starbuzz", "Flavor": "Blue Mist", "List": "Plan to smoke", "Rating": "0" }, { "Brand": "Ugly Shisha", "Flavor": "Happy Hour", "List": "Plan to smoke", "Rating": "3" }, { "Brand": "Fumari", "Flavor": "Orange Cream", "List": "Plan to smoke", "Rating": "" }], "Disliked": [{ "Brand": "Starbuzz", "Flavor": "Hard Rush", "List": "Disliked", "Rating": "1" }, { "Brand": "Starbuzz", "Flavor": "Pink", "List": "Disliked", "Rating": "2" }, { "Brand": "Ugly Shisha", "Flavor": "Pomegranate", "List": "Disliked", "Rating": "1" }, { "Brand": "Fumari", "Flavor": "Mint", "List": "Disliked", "Rating": "0" }] };
			let res = await client.db("shisha-saver").collection("users").updateOne({ "username": "test" }, { $set: myList });
			console.log(res);
		} catch (error) {
			console.log(error);
		} finally {
			client.close();
		}
}

// Gets and returns a list of usernames and passwords
async function GetUserPassword(username) {
	const client = await MongoClient.connect("mongodb://localhost:27017/").catch(err => { console.log(err) });
	if (!client) {
		return;
	}
	try {
		let res = await client.db("shisha-saver").collection("users").findOne({ "username": username });
		if (res == null) {
			console.log("Could not find a user with username:" + username);
			return null;
		}
		return res['password'];
	} catch (error) {
		console.log(error);
	} finally {
		client.close();
	}
}

// Exports
module.exports.GetShisha = GetShisha;
module.exports.AddShisha = AddShisha;
module.exports.HardReset = HardReset;
module.exports.GetUserPassword = GetUserPassword;