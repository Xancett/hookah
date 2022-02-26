// Requires

// Global variables
let authenticatedUsers = {"tokens": []};

// Functions

// Logs in the user, takes in username/password and if found setsup security token, passes it back
async function Login(username, password) {
	// Check if username and password are correct

	// Generate token
	let token = GenerateToken();
}

// Checks if the authentication token is still valid
function Authenticated(token) {
	// Clear any old tokens first
	ClearOldTokens();
	// Check if the token exists in the list
}

// Clears out any old tokens
function ClearOldTokens() {

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

// Exports
module.exports.Login = Login;
module.exports.Authenticated = Authenticated;