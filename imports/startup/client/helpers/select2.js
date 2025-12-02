// imports/startup/client/helpers/select2.js
import TomSelect from "tom-select";
import "tom-select/dist/css/tom-select.bootstrap5.css";

initSelect2 = () => {
	Meteor.defer(() => {
		const selects = document.querySelectorAll("select.select2");

		selects.forEach((el) => {
			const isMultiple = el.hasAttribute("multiple");
			const placeholder =
				el.getAttribute("data-placeholder") || "Select an option";

			// 💣 si ya existe instancia previa, destruirla para que lea de nuevo las <option>
			if (el.tomselect) {
				el.tomselect.destroy();
			}

			const baseOptions = {
				placeholder,
				allowEmptyOption: true,
				plugins: isMultiple ? ["remove_button"] : [],
			};

			// eslint-disable-next-line no-new
			new TomSelect(el, baseOptions);
		});
	});
};
