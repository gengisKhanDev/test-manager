import { Template } from "meteor/templating";

Template.registerHelper("formatName", function (name) {
	if (!name) return "";
	const lower = String(name).toLowerCase();
	return lower.charAt(0).toUpperCase() + lower.slice(1);
});

formatName = (name) => {
	if (!name) return "";
	const lower = String(name).toLowerCase();
	return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const attachFormatNameListener = () => {
	if (attachFormatNameListener._initialized) return;
	attachFormatNameListener._initialized = true;

	document.addEventListener("input", (event) => {
		const target = event.target;
		if (!(target instanceof HTMLInputElement)) return;
		if (!target.classList.contains("format-name")) return;

		const value = target.value;
		if (!value) return;

		target.value = value.charAt(0).toUpperCase() + value.slice(1);
	});
};

initFormatName = () => {
	attachFormatNameListener();
};
