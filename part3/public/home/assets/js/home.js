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
}