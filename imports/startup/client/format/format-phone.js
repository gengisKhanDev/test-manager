import { Template } from "meteor/templating";

Template.registerHelper("formatPhone", function (phone) {
	if (typeof phone === "undefined" || phone === null) {
		return "N/A";
	}

	const digits = String(phone).replace(/[^\d]/g, "");
	if (digits.length !== 10) return phone;
	return digits.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
});

const attachFormatPhoneListener = () => {
	if (attachFormatPhoneListener._initialized) return;
	attachFormatPhoneListener._initialized = true;

	document.addEventListener("input", (event) => {
		const target = event.target;
		if (!(target instanceof HTMLInputElement)) return;
		if (!target.classList.contains("format-phone")) return;

		const digits = target.value.replace(/\D/g, "");
		const parts = digits.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
		if (!parts) return;

		const [, p1, p2, p3] = parts;
		let formatted = p1;
		if (p2) formatted = `(${p1}) ${p2}`;
		if (p3) formatted += `-${p3}`;
		target.value = formatted;
	});
};

formatPhoneInput = () => {
	attachFormatPhoneListener();
};
