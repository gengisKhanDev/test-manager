import TomSelect from "tom-select";
import "tom-select/dist/css/tom-select.bootstrap5.css";

initSelect2 = () => {
	Meteor.defer(() => {
		const selects = document.querySelectorAll("select.select2");

		selects.forEach((el) => {
			const isMultiple = el.hasAttribute("multiple");
			const placeholder =
				el.getAttribute("data-placeholder") || "Select an option";

			if (el.tomselect) {
				el.tomselect.destroy();
			}

			const optionsDebug = Array.from(el.options).map((o) => ({
				value: o.value,
				text: o.textContent,
			}));
			console.log(
				"[initSelect2] opciones de",
				`#${el.id}`,
				"=>",
				optionsDebug,
			);

			new TomSelect(el, {
				placeholder,
				allowEmptyOption: true,
				plugins: isMultiple ? ["remove_button"] : [],
				searchField: ["text", "value"],
				maxOptions: 1000,
				onInitialize() {
					console.log(
						"[TomSelect] inicializado en",
						`#${el.inputId || el.id}`,
						"con opciones:",
						this.options,
					);
				},
			});
		});
	});
};
