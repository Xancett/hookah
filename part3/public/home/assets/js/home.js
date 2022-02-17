document.addEventListener('click', e => {
	// Get the selected object
	const origin = e.target.closest('a');
	// Go through all selectable menu items and remove chosen if found
	const menuOptions = document.querySelectorAll('#menu');
	menuOptions.forEach(menu => {
		if (menu.classList.contains("chosen")) {
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

// TODO
// 1. Check that the call for selecting a menu option isn't already selected