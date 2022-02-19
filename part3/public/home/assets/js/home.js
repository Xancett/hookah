(function () {
	UpdateTable('Enjoyed');
})()

document.addEventListener('click', e => {
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
		UpdateTable(origin.text);
	}
});

// Set the table to fill out from the API call
async function UpdateTable(menuOption) {
	console.log(menuOption);
	let hookahAPI = 'https://er27enht4f.execute-api.us-east-1.amazonaws.com/default/fetch-shisha';
	switch (menuOption) {
		case 'All Flavors':
			// Fetch all flavors from the API
			let jsonData = { "data": "brands" };
			const information = {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(jsonData)
			};
			// Send out information
			let response = await fetch(hookahAPI, information);
			// Wait for a response
			let data = await response.json();
			console.log(data);
			jsonData['data'] = "flavors";
			jsonData['brand'] = data[0];
			information['body'] = JSON.stringify(jsonData);
			response = await fetch(hookahAPI, information);
			// Wait again
			data = await response.json();
			console.log(data);
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
			/*
			let row = document.createElement('tr');
			let cell = document.createElement('td');
			cell.innerText = "Hello";
			row.appendChild(cell);
			cell.innerText = "World";
			row.appendChild(cell);
			//row.appendChild(document.createElement('td').innerHTML("World"));
			//row.appendChild(document.createElement('td').innerHTML(data[0]));*/
			$("#tableOfContents").append(row);
		case 'Enjoyed':
			break;
		case 'Plan to smoke':
			break;
		case 'Disliked':
			break;
	}
}