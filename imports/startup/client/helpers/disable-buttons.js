disableBtn = (selector, disable, defaultHTML) => {
	const spinnerHTML = `<i class="fas fa-spin fa-spinner"></i> Loading...`;

	if (selector === "form") {
		const buttons = document.querySelectorAll("button[type='submit']");
		buttons.forEach((btn) => {
			btn.disabled = !!disable;
			btn.innerHTML = disable ? spinnerHTML : defaultHTML;
		});
		return;
	}

	const buttons = document.querySelectorAll(selector);
	buttons.forEach((btn) => {
		btn.disabled = !!disable;
		btn.innerHTML = disable ? spinnerHTML : defaultHTML;
	});
};
