import "./add-test-modal.html";
import { Meteor } from "meteor/meteor";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

import "/imports/ui/helpers/logicHelpers";

Template.add_test_modal.onCreated(function () {
	const instance = this;

	instance.autorun(() => {
		const projectId = FlowRouter.getParam("id");
		if (!projectId) return;

		console.log("[add_test_modal] onCreated projectId =>", projectId);
		instance.subscribe("projectDevelopersUsers", projectId);
	});
});

Template.add_test_modal.onRendered(function () {
	const instance = this;

	initFlatpickr({
		selector: "#fechaEstimada",
		minDate: "today",
	});

	// Re-init TomSelect cuando las subs de ESTE modal estén listas
	instance.autorun(() => {
		if (instance.subscriptionsReady()) {
			Tracker.afterFlush(() => {
				console.log("[add_test_modal] subs ready, initSelect2");
				initSelect2();
			});
		}
	});
});

Template.add_test_modal.helpers({
	developersInProject() {
		const projectId = FlowRouter.getParam("id");
		if (!projectId) return [];

		const users = Meteor.users.find({
			projects: {
				$elemMatch: {
					id: projectId,
					role: { $in: ["Desarrollador", "Creador"] }, // 👈 mismo filtro que en la publicación
				},
			},
		}).fetch();

		console.log("[developersInProject] projectId =>", projectId);
		console.log("[developersInProject] users =>", users);

		return users.map((user) => {
			const devProject = (user.projects || []).find(
				(p) =>
					p.id === projectId &&
					["Desarrollador", "Creador"].includes(p.role),
			);

			return {
				id: user._id,
				name: `${user.profile?.firstName || ""} ${user.profile?.lastName || ""
					}`.trim(),
				role: devProject?.role || "Desarrollador",
			};
		});
	},
});

Template.add_test_modal.events({
	"change #testImage .file"(event) {
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
