// Sets information in the table on if the table is being loaded or not with data
function LoadingData(loading) {
	if (loading) {
		$("body").addClass("loading");
	} else {
		$("body").removeClass("loading");
	}
}