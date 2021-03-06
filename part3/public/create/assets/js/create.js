
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
				CreateAccount(form[0].value, form[1].value);
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
async function CreateAccount(username, password) {
	// First remove the is-invalid class from username in case it was added
	document.getElementById("formUsername").classList.remove("is-invalid");
	try {
		// Setup request
		const jsonData = { 'username': username, 'password': password };
		const information = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(jsonData)
		};
		const response = await fetch('/createaccount', information);
		if (response.redirected) {
			// Account created, no issues here
			window.location.href = response.url;
		} else {
			// Account not yet created, there is an error
			LoadingData(false);
			let res = await response.json();
			if (res.Error == "Username already exists") {
				document.getElementById("formUsername").classList.add("is-invalid");
			}
		}
	} catch (error) {
		console.log(error);
	}
}