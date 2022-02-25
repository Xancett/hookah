(function () {
	UpdateTable('Enjoyed');
})()

// Global variable to hold the different brands from the API
let brands = {};

// Adds the event listener to the menu
document.addEventListener('click', e => {
	// Check if we should foward to optioncheck
	if (e.target.closest('option') != null) {
		// Update parent with value
		e.target.closest('option').parentElement.setAttribute("value", e.target.closest('option').text);
		// Update server with changes
		OptionChange(e.target.closest('option').parentElement.parentElement.parentElement);
		return;
	}
	// Check if we are selecting menu items
	if (e.target.closest('a') != null) {
		// Get the selected object
		let origin = e.target.closest('a');
		// Go through all selectable menu items and remove chosen if found
		const menuOptions = document.querySelectorAll('#menu');
		menuOptions.forEach(menu => {
			if (menu.classList.contains("chosen")) {
				// Check if we are just selecting the same menu
				if (menu == origin) {
					// Set the origin to null so nothing is updated
					origin = null;
					return; // So we don't remove 'chosen' from the currently selected menu
				}
				menu.classList.remove("chosen");
			}
		});
		// Change the selected object to be chosen
		if (origin) {
			origin.classList.add('chosen');
			ClearTable();
			UpdateTable(origin.text);
		}
	}
	// Check if we are selecting a stars rating
	if (e.target.closest('label') != null) {
		e.target.closest('label').previousElementSibling.checked = true;
		e.target.closest('label').parentElement.setAttribute("value", e.target.closest('label').previousElementSibling.value);
		OptionChange(e.target.closest('label').parentElement.parentElement.parentElement);
	}
});

// Set function for scrolling window
window.onscroll = function (ev) {
	if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
		// Check which option is chosen
		const menuOptions = document.querySelectorAll('#menu');
		menuOptions.forEach(menu => {
		if (menu.classList.contains("chosen")) {
			// Check if All Flavors is selected
			if (menu.textContent == 'All Flavors') {
				UpdateTable('All Flavors');
			}
		}
	});
	}
}

// Set the table to fill out from the API call
async function UpdateTable(menuOption) {
	LoadingData(true);
	let hookahAPI = 'https://er27enht4f.execute-api.us-east-1.amazonaws.com/default/fetch-shisha';
	let listData = {};
	if (menuOption == 'All Flavors') {
		const information = {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: ""
		};	
		// Check if brands is empty
		if (Object.keys(brands).length == 0) {
			// Fetch all flavors from the API
			let jsonData = { "data": "brands" };
			information['body'] = JSON.stringify(jsonData);
			// Send out information
			let response = await fetch(hookahAPI, information);
			// Wait for a response
			let data = await response.json();
			brands = JSON.parse(JSON.stringify(data)); // Deep copy needed
		}
		if (brands['data'] == 'return') {
			LoadingData(false);
			return;
		}
		let jsonData = { 'data': 'flavors', 'brand': brands[Object.keys(brands)[0]] };
		information['body'] = JSON.stringify(jsonData);
		response = await fetch(hookahAPI, information);
		// Wait again
		let data = await response.json();
		LoadingData(false);
		const table = document.querySelectorAll('#tableOfContents');
		for (var i = 0; i < Object.keys(data).length; i++) {
			let row = document.createElement('tr');
			let cell1 = document.createElement('td');
			let cell2 = document.createElement('td');
			let cell3 = document.createElement('td');
			let cell4 = document.createElement('td');
			let cell5 = document.createElement('td');
			cell1.innerText = "Image missing";
			cell2.innerText = jsonData['brand'];
			cell3.innerText = Object.keys(data)[i];
			let s = document.createElement('select');
			let op0 = document.createElement('option');
			Object.assign(op0, { "text": "Select a list", "selected": true, "hidden": true, "disabled": true });
			let op1 = document.createElement('option');
			Object.assign(op1, { "text": "Enjoyed", "value": "Enjoyed" });
			let op2 = document.createElement('option');
			Object.assign(op2, { "text": "Plan to smoke", "value": "Plan to smoke" });
			let op3 = document.createElement('option');
			Object.assign(op3, { "text": "Disliked", "value": "Disliked" });
			s.append(op0, op1, op2, op3);
			cell4.append(s);
			cell5.appendChild(document.createElement('div'));
			Object.assign(cell5.children[0], { "innerText": "Not rated", "value": "0" });
			row.appendChild(cell1);
			row.appendChild(cell2);
			row.appendChild(cell3);
			row.appendChild(cell4);
			row.appendChild(cell5);
			$("#tableOfContents").append(row);
		}
		delete brands[Object.keys(brands)[0]];
		// Check if we have hit the end and shouldn't load anymore data
		if (Object.keys(brands).length == 0) {
			brands = { 'data': 'return' };
		}
	} else {
		listData = await GetList(menuOption);
		LoadingData(false);
		for (var i = 0; i < listData['data'].length; i++) {
			let row = document.createElement('tr');
			let cell1 = document.createElement('td');
			let cell2 = document.createElement('td');
			let cell3 = document.createElement('td');
			let cell4 = document.createElement('td');
			let cell5 = document.createElement('td');
			cell1.innerText = "Image missing";
			cell2.innerText = listData['data'][i].Brand;
			cell3.innerText = listData['data'][i].Flavor;
			// Create a dropdown
			let s = document.createElement('select');
			s.setAttribute("value", menuOption);
			let op1 = document.createElement('option');
			Object.assign(op1, { "text": "Enjoyed", "value": "Enjoyed", "selected": (menuOption == "Enjoyed") });
			let op2 = document.createElement('option');
			Object.assign(op2, { "text": "Plan to smoke", "value": "Plan to smoke", "selected": (menuOption == "Plan to smoke") });
			let op3 = document.createElement('option');
			Object.assign(op3, { "text": "Disliked", "value": "Disliked", "selected": (menuOption == "Disliked") });
			s.append(op1, op2, op3);
			cell4.append(s);
			//cell5.innerText = listData['data'][i].Rating;
			cell5.appendChild(GetStars(listData['data'][i].Rating, listData['data'][i].Flavor));
			row.appendChild(cell1);
			row.appendChild(cell2);
			row.appendChild(cell3);
			row.appendChild(cell4);
			row.appendChild(cell5);
			$("#tableOfContents").append(row);
		}
	}
}

// Function to get the list requested from the server
async function GetList(listRequest) {
	try {
		// Setup request
		const jsonData = { 'inforequest': listRequest };
		const information = {
			method: 'POST',
			mode: 'cors',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(jsonData)
		};
		// Send out information
		const response = await fetch('/hookahapi', information);
		//console.log(response);
		// Wait for the response
		let data = await response.json();
		// Need to organize the data first, then return
		let results = data['data'];
		results.sort(function (a, b) {
			if (a.Rating > b.Rating) {
				return -1;
			} else if (a.Rating < b.Rating) {
				return 1;
			} else {
				return 0;
			}
		});
		data['data'] = results;
		return data;
	} catch (error) {
		console.log(error);
	}
}

// Gets the selected option being chosen and changes it 
function OptionChange(op) {
	optionChange = {
		data : [
			{
				'Brand' : op.cells[1].textContent,
				'Flavor' : op.cells[2].textContent,
				'List': op.cells[3].children[0].getAttribute("value"),
				'Rating': op.cells[4].children[0].getAttribute("value")
			}
		]
	};
	UpdateServer(optionChange);
}

// Updates the server with data
async function UpdateServer(data) {
	try {
		// Setup request
		const jsonData = { 'inforequest': data };
		const information = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(jsonData)
		};
		const response = await fetch('/shishaupdate', information);
	} catch (error) {
		console.log(error);
	}
}

function ClearTable() {
	$("#tableOfContents tr").remove();
	brands = {};
}

function GetStars(rating, flavor) {
	let top = document.createElement('div');
	top.classList.add("rating");
	top.setAttribute("value", rating);
	for (var i = 5; i >= 1; i--) {
		top.appendChild(document.createElement('input'));
		Object.assign(top.children[top.children.length - 1], { "type": "radio", "name": flavor, "value": i.toString(), "id": i.toString(), "checked": (i == rating) });
		top.appendChild(document.createElement('label'));
		Object.assign(top.children[top.children.length - 1], { "for": i.toString(), "innerText": "☆" });
	}
	return top;
}

// Sets information in the table on if the table is being loaded or not with data
function LoadingData(loading) {
	if (loading) {
		$("body").addClass("loading");
	} else {
		$("body").removeClass("loading");
	}
}