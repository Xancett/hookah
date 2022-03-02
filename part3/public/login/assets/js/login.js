
// Event listener for the submit button
window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
		form.addEventListener('submit', function(event) {
			if (form.checkValidity() === false) {
				console.log("Form not validated");
				//event.preventDefault();
          		//event.stopPropagation();
			} else {
				console.log("Start spinning wheel");
				LoadingData(true);
				event.preventDefault();
				LogIn(form[0].value, form[1].value);
			}
    	}, false);
	});
}, false);

// Sets information in the table on if the table is being loaded or not with data
function LoadingData(loading) {
	if (loading) {
		$("body").addClass("loading");
	} else {
		$("body").removeClass("loading");
	}
}

// Starts the call for logging in
async function LogIn(username, password) {
	let token = "";
	ClearCookies();
	try {
		// Setup request
		const jsonData = { 'username': username, 'password': password };
		const information = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(jsonData)
		};
		const response = await fetch('/shishalogintoken', information);
		let data = await response.json();
		const d = new Date();
		d.setTime(d.getTime() + 86400000);
		document.cookie = "SecurityToken=" + data['SecurityToken'] + "; SameSite=Strict;" + "expires=" + d.toUTCString() + ";path=/";
		let token = data['SecurityToken'];
		LoadingData(false);
		PageRedirect(token);
	} catch (error) {
		console.log(error);
	}
}

async function PageRedirect(token) {
	try {
		// Setup request
		const information = {
			method: 'GET',
			headers: { 'Content-Type': 'application/json', 'SecurityToken': token }
		};
		const response = await fetch('/', information);
		window.location.href = response.url;
	} catch (error) {
		console.log(error);
	}
}

function ClearCookies() {
	document.cookie = "SecurityToken= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
}