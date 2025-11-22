document.addEventListener("keydown", (event) => {
	const target = event.target;

	// Solo nos interesa el input con id="multiInput"
	if (!(target instanceof HTMLInputElement)) return;
	if (target.id !== "multiInput") return;

	const isEnter = event.key === "Enter";
	const isTab = event.key === "Tab";
	const isSpace = event.key === " ";

	if (!isEnter && !isTab && !isSpace) return;

	event.preventDefault();

	const value = target.value.trim();
	if (!value) return;

	const container = document.getElementById("input-container");
	if (!container) return;

	const chip = document.createElement("span");
	chip.className = "encapsulated";
	chip.innerHTML = `${value} <span class="close-btn">&times;</span>`;
	container.appendChild(chip);

	target.value = "";
});

// Permitir eliminar chips haciendo click en la X
document.addEventListener("click", (event) => {
	const target = event.target;
	if (!(target instanceof HTMLElement)) return;

	if (target.classList.contains("close-btn")) {
		const chip = target.closest(".encapsulated");
		if (chip) chip.remove();
	}
});
