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

// Exponer en window para poder usarla en otros scripts
window.sourAlert = function (data, callback = () => { }) {
	// Quitar alerta previa
	const old = document.querySelector("body .sour-alert");
	if (old) old.remove();

	const wrapper = document.createElement("div");
	wrapper.className = "sour-alert";
	// Equivalente a $('.sour-alert').show()
	wrapper.style.display = "block";

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

	// Título y HTML
	titleEl.innerHTML = data.title || "";
	if (typeof data.html !== "undefined") {
		htmlEl.innerHTML = data.html;
	}

	// *** Comportamiento de botones igual al de jQuery ***

	// Todos ocultos al inicio
	btnOk.style.display = "none";
	btnRemove.style.display = "none";
	btnCancel.style.display = "none";

	// type
	switch (data.type) {
		case "success": {
			titleEl.style.color = "#27ae60";
			// En jQuery: en success se muestra OK por defecto
			btnOk.style.display = "inline-block";
			break;
		}
		case "question": {
			titleEl.style.color = "#e74c3c";
			// En jQuery: sólo se muestra Cancel aquí
			btnCancel.style.display = "inline-block";
			break;
		}
		case "warning": {
			titleEl.style.color = "#e67e22";
			// En jQuery: sólo se muestra Remove aquí
			btnRemove.style.display = "inline-block";
			break;
		}
		default: {
			titleEl.style.color = "#000000";
			break;
		}
	}

	// Textos de botones
	if (typeof data.okButtonText !== "undefined") {
		btnOk.textContent = data.okButtonText;
	}
	if (typeof data.removeButtonText !== "undefined") {
		btnRemove.textContent = data.removeButtonText;
	}
	if (typeof data.cancelButtonText !== "undefined") {
		btnCancel.textContent = data.cancelButtonText;
	}

	// Mostrar / ocultar OK como en jQuery
	if (data.showOkButton === true || typeof data.showOkButton === "undefined") {
		btnOk.style.display = "inline-block";
	} else if (data.showOkButton === false) {
		btnOk.style.display = "none";
	}

	// Función para resetear estados
	const resetButtons = () => {
		btnOk.disabled = false;
		btnOk.textContent = data.okButtonText || "OK";
		btnRemove.disabled = false;
		btnCancel.disabled = false;
	};

	// loading
	if (data.loading) {
		btnOk.disabled = true;
		btnOk.textContent = "Loading...";
		btnRemove.disabled = true;
		btnCancel.disabled = true;
	}

	// hide (auto ocultar sólo UI)
	if (data.hide) {
		setTimeout(() => {
			wrapper.style.display = "none";
			resetButtons();
		}, 1250);
	}

	// autoClose (igual que jQuery: oculta y llama callback)
	if (data.autoClose === true) {
		btnOk.style.display = "none";
		let alertTimeout = 1250;
		if (typeof data.timer !== "undefined") {
			alertTimeout = data.timer;
		}
		setTimeout(() => {
			wrapper.style.display = "none";
			resetButtons();
			callback(true);
		}, alertTimeout);
	}

	// Listeners
	btnOk.addEventListener("click", () => {
		callback(true);
		// Simil a jQuery: primero callback, luego escondemos y limpiamos
		setTimeout(() => {
			resetButtons();
			wrapper.remove();
		}, 1250);
	});

	btnRemove.addEventListener("click", () => {
		callback(true);
		setTimeout(() => {
			resetButtons();
			wrapper.remove();
		}, 1250);
	});

	btnCancel.addEventListener("click", () => {
		// En jQuery: sólo hace fadeOut; aquí ocultamos
		wrapper.style.display = "none";
		resetButtons();
	});
};

