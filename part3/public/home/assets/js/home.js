(function () {
	UpdateTable('Enjoyed');
})()

// Global variable to hold the different brands from the API
let brands = {};

// Adds the event listener to the menu
document.addEventListener('click', e => {
	// Get the selected object
	let origin = e.target.closest('a');
	if (!origin) return; // No point in changing anything if what we clicked on is null
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
});

// Set function for scrolling window
window.onscroll = function (ev) {
	if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
		console.log("Load more content");
		UpdateTable('All Flavors');
	}
}

// Set the table to fill out from the API call
async function UpdateTable(menuOption) {
	console.log(menuOption);
	let hookahAPI = 'https://er27enht4f.execute-api.us-east-1.amazonaws.com/default/fetch-shisha';
	let listData = {};
	switch (menuOption) {
		case 'All Flavors':
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
			if (brands['data'] == 'return') return;
			let jsonData = { 'data': 'flavors', 'brand': brands[Object.keys(brands)[0]] };
			information['body'] = JSON.stringify(jsonData);
			response = await fetch(hookahAPI, information);
			// Wait again
			let data = await response.json();
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
				cell4.innerText = "None";
				cell5.innerText = "Not rated";
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
		case 'Enjoyed':
			listData = await GetList(menuOption);
			for (var i = 0; i < listData['data'].length; i++) {
				console.log("Brand: " + listData['data'][i].Brand);
				console.log("Flavor: " + listData['data'][i].Flavor);
				console.log("List: " + listData['data'][i].List);
				console.log("Rating: " + listData['data'][i].Rating);
			}
		case 'Plan to smoke':
			break;
		case 'Disliked':
			break;
	}
}

// Function to get the list requested from the server
async function GetList(listRequest) {
	try {
		// Setup request
		const jsonData = { 'inforequest': listRequest };
		const information = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(jsonData)
		};
		/*
		// Send out information
		const response = await fetch('/hookahapi', information);
		// Wait for the response
		let data = await response.json();
		// Need to organize the data first, then return
		return data;
		*/
		// Mock data starts here
		let data = {};
		switch (listRequest) {
			case 'Enjoyed':
				data = {
					'data': [
						{
							'Brand': 'Starbuzz',
							'Flavor': 'Black Grape',
							'List': 'Enjoyed',
							'Rating': '3'
						},
						{
							'Brand': 'Starbuzz',
							'Flavor': 'Candy',
							'List': 'Enjoyed',
							'Rating': '5'
						},
						{
							'Brand': 'Ugly Shisha',
							'Flavor': 'Hurricane',
							'List': 'Enjoyed',
							'Rating': '4'
						},
						{
							'Brand': 'Fumari',
							'Flavor': 'Sour Cherry',
							'List': 'Enjoyed',
							'Rating': '3'
						}
					]
				};
				break;
			case 'Plan to smoke':
				data = {
					'data': [
						{
							'Brand': 'Starbuzz',
							'Flavor': 'Classic Mojito',
							'List': 'Plan to smoke',
							'Rating': '0'
						},
						{
							'Brand': 'Starbuzz',
							'Flavor': 'Blue Mist',
							'List': 'Plan to smoke',
							'Rating': '0'
						},
						{
							'Brand': 'Ugly Shisha',
							'Flavor': 'Happy Hour',
							'List': 'Plan to smoke',
							'Rating': '3'
						},
						{
							'Brand': 'Fumari',
							'Flavor': 'Orange Cream',
							'List': 'Plan to smoke',
							'Rating': '0'
						}
					]
				};
				break;
			case 'Disliked':
				data = {
					'data': [
						{
							'Brand': 'Starbuzz',
							'Flavor': 'Hard Rush',
							'List': 'Enjoyed',
							'Rating': '1'
						},
						{
							'Brand': 'Starbuzz',
							'Flavor': 'Pink',
							'List': 'Enjoyed',
							'Rating': '2'
						},
						{
							'Brand': 'Ugly Shisha',
							'Flavor': 'Pomegranate',
							'List': 'Enjoyed',
							'Rating': '1'
						},
						{
							'Brand': 'Fumari',
							'Flavor': 'Mint',
							'List': 'Enjoyed',
							'Rating': '0'
						}
					]
				};
				break;
		}
		// Organize data here before returning it
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


function ClearTable() {
	$("#tableOfContents tr").remove();
	brands = {};
}