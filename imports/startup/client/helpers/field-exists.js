Template.registerHelper("fieldExists", function (value) {
	if (!value) {
		return "N/A";
	}
	else {
		return value;
	}
});

fieldExists = (value) => {
	if (value) {
		return value;
	}
	else {
		return "N/A";
	}
}
Template.registerHelper('eq', function (a, b) {
	return a === b;
});
