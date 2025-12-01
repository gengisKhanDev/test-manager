//type: "success", "question", "warning" <string>
//title: "this is a title" <string>
//okButtonText: "text" <string>
//removeButtonText: "text" <string>
//cancelButtonText: "text" <string>
//showOkButton: true/false <boolean>
//html: HTML <string>
//autoClose: true/false <boolean>
//timer: 3000 <integer>
//hide: true <boolean>

sourAlert = (data, callback = () => { }) => {
	// Limpia cualquier alerta previa
	const old = document.querySelector("body .sour-alert");
	if (old) old.remove();

	const wrapper = document.createElement("div");
	wrapper.className = "sour-alert";
	wrapper.innerHTML = `
    <div class="title"></div>
    <div class="html"></div>
    <div class="buttons">
      <button type="button" id="sourAlertOK" style="display: none;" class="btn btn-success">OK</button>
      <button type="button" id="sourAlertRemove" style="display: none;" class="btn btn-danger">Remove</button>
      <button type="button" id="sourAlertCancel" style="display: none;" class="btn btn-danger">Cancel</button>
    </div>
  `;

	document.body.prepend(wrapper);

	const titleEl = wrapper.querySelector(".title");
	const htmlEl = wrapper.querySelector(".html");
	const btnOk = wrapper.querySelector("#sourAlertOK");
	const btnRemove = wrapper.querySelector("#sourAlertRemove");
	const btnCancel = wrapper.querySelector("#sourAlertCancel");

	titleEl.textContent = data.title || "";
	if (data.html) {
		htmlEl.innerHTML = data.html;
	}

	// Tipo => color + buttons visibles
	switch (data.type) {
		case "success":
			titleEl.style.color = "#27ae60";
			btnOk.style.display = "inline-block";
			break;
		case "question":
			titleEl.style.color = "#e74c3c";
			btnCancel.style.display = "inline-block";
			btnOk.style.display = "inline-block";
			break;
		case "warning":
			titleEl.style.color = "#e67e22";
			btnRemove.style.display = "inline-block";
			btnOk.style.display = "inline-block";
			break;
		default:
			titleEl.style.color = "#000000";
			btnOk.style.display = "inline-block";
	}

	if (data.okButtonText) btnOk.textContent = data.okButtonText;
	if (data.removeButtonText) btnRemove.textContent = data.removeButtonText;
	if (data.cancelButtonText) btnCancel.textContent = data.cancelButtonText;

	if (data.showOkButton === false) {
		btnOk.style.display = "none";
	}

	const resetButtons = () => {
		btnOk.disabled = false;
		btnOk.textContent = data.okButtonText || "OK";
		btnRemove.disabled = false;
		btnCancel.disabled = false;
	};

	if (data.loading) {
		btnOk.disabled = true;
		btnOk.textContent = "Loading...";
		btnRemove.disabled = true;
		btnCancel.disabled = true;
	}

	const close = () => {
		resetButtons();
		wrapper.remove();
	};

	// Auto-close simple (sólo UI, esto sí tiene sentido)
	if (data.hide === true) {
		setTimeout(close, 1250);
	}

	if (data.autoClose === true) {
		const alertTimeout = typeof data.timer === "number" ? data.timer : 1250;
		setTimeout(() => {
			callback(true);
			close();
		}, alertTimeout);
	}

	// Listeners: aquí cierro INMEDIATO
	btnOk.addEventListener("click", () => {
		callback(true);
		close();
	});

	btnRemove.addEventListener("click", () => {
		callback(true);
		close();
	});

	btnCancel.addEventListener("click", () => {
		callback(false);
		close();
	});
};
