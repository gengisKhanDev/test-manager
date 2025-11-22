import "./add-proyect-modal.html";

Template.add_proyect_modal.events({
	"submit #addProyectForm"(event) {
		event.preventDefault();

		const proyectName = event.target.proyectName.value;
		const descriptionProyect = event.target.descriptionProyect.value;

		Meteor.call("add.proyect", proyectName, descriptionProyect, function (error, result) {
			if (error) {
				console.log(error);
				yoloAlert("error");
			}
			else {
				yoloAlert("success", "Proyecto Creado!");
			}
		});
	}
});
