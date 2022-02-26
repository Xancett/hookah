// Requires

// Global variables
let authenticatedUsers = {"tokens": []};

// Functions

// Logs in the user, takes in username/password and if found setsup security token, passes it back
async function Login(username, password) {

}

// Checks if the authentication token is still valid
function Authenticated(token) {
	ClearOldTokens();
}

// Clears out any old tokens
function ClearOldTokens() {

}

// Exports
module.exports.Login = Login;
module.exports.Authenticated = Authenticated;