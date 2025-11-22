import "./add-test-modal.html";
import { Meteor } from "meteor/meteor";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

import { Proyects } from "../../../../api/proyects/proyects.js";
import { Settings } from "../../../../api/settings/settings.js";
import { Invitations } from "../../../../api/invitations/invitations.js";
import "/imports/ui/helpers/logicHelpers";

Template.add_test_modal.onCreated(function () {
	const instance = this;

	instance.autorun(() => {
		const projectId = FlowRouter.getParam("id");

		instance.subscribe("projectDevelopers", projectId);
		instance.subscribe("roles.all");
		instance.subscribe("projectUsers", projectId);
	});
});

Template.add_test_modal.onRendered(function () {
	initFlatpickr({
		selector: "#fechaEstimada",
		minDate: "today",
	});
});

Template.add_test_modal.helpers({
	developersInProject() {
		const projectId = FlowRouter.getParam("id");
		const project = Proyects.findOne({ _id: projectId });

		if (!project || !project.team) {
			return [];
		}

		const invitations = Invitations.find({ "proyect._id": projectId }).fetch();

		return project.team.map((member) => {
			const user = Meteor.users.findOne({ _id: member.id });
			const invitation = invitations.find(
				(invite) => invite.profile.id === member.id,
			);

			return {
				...member,
				profile: user ? user.profile : {},
				status: invitation ? invitation.status : "accepted",
			};
		});
	},
});

Template.add_test_modal.events({
	"change #testImage"(event) {
		uploadImage({ text: "Drag and Drop Image" }, event, (fileObject) => {
			Session.set("imageTest", fileObject);
			yoloAlert("success", "Imagen Agregada!");
		});
	},

	"submit #quillForm"(event) {
		event.preventDefault();

		const selectPrueba = event.target.selectPrueba.value;
		const selectDesarrollador = event.target.selectDesarrollador.value;
		const fechaEstimada = event.target.fechaEstimada.value;
		const comments = event.target.commentModule.value;

		const imageDesarrollador = Session.get("imageTest");
		const imageToSend = imageDesarrollador || null;

		Meteor.call(
			"add.proyect.test",
			FlowRouter.getParam("id"),
			selectPrueba,
			selectDesarrollador,
			fechaEstimada,
			comments,
			imageToSend,
			(error, result) => {
				if (error) {
					console.log(error);
					yoloAlert("error");
				} else {
					yoloAlert("success", "Test Creado!");
					console.log(result);
					Session.set("testIDGlobal", result);
				}
			},
		);
	},
});
