// Requires
const bcrypt = require('bcrypt');

// Global variables
let authenticatedUsers = {"tokens": []};

// Functions

// Logs in the user, takes in username/password and if found setsup security token, passes it back
async function Login(username, password, db) {
	// Check if username and password are correct
	let dbPass = await db.GetUserPassword(username);
	if (dbPass == null) { return null; }
	// If the password doesn't match, return null
	let comp = await bcrypt.compare(password, dbPass);
	if (!comp) {
		return null;
	}
	// Generate token
	let token = GenerateToken();
	// Setup for list
	let oneHour = 3600000;
	// Add to the authenticatedUsers list
	authenticatedUsers['tokens'].push({ 'username': username, 'token': token, 'expiration': Date.now() + oneHour });
	return token;
}

// Checks if the authentication token is still valid
function Authenticated(token) {
	// Clear any old tokens first
	ClearOldTokens();
	// Check if the token exists in the list
	for (let i = 0; i < authenticatedUsers['tokens'].length; i++) {
        if (token == authenticatedUsers['tokens'][i]['token']) {
            return true;
        }
    }
    return false;
}

// Looks through the authenticatedUsers using the token and returns the username
function GetUsername(token) {
	for (let i = 0; i < authenticatedUsers['tokens'].length; i++) {
		if (token == authenticatedUsers['tokens'][i]['token']) {
			return authenticatedUsers['tokens'][i]['username'];
        }
	}
	return null;
}

// Clears out any old tokens
function ClearOldTokens() {
	// Check if array is empty
	if (authenticatedUsers['tokens'].length == 0) { return; }
	// Iterate backwards through the array
	for (let i = authenticatedUsers['tokens'].length - 1; i >= 0; i--) {
		if (Date.now() > authenticatedUsers['tokens'][i]['expiration']) {
			authenticatedUsers['tokens'].splice(i, 1);
		}
	}
}

// Generates a random security token
function GenerateToken() {
	let length = 12;
	let result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

// Hashes password and returns result
async function HashPassword(password) {
	const hash = await bcrypt.hash(password, 10);
	return hash;
}


// Exports
module.exports.Login = Login;
module.exports.Authenticated = Authenticated;
module.exports.GetUsername = GetUsername;