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

		const users = Meteor.users
			.find({
				projects: {
					$elemMatch: {
						id: projectId,
						role: { $in: ["Desarrollador", "Creador"] },
					},
				},
			})
			.fetch();

		console.log("[developersInProject] users =>", users);

		return users.map((user) => {
			const fullName = `${user.profile?.firstName || ""} ${user.profile?.lastName || ""
				}`.trim();

			const email = user.emails?.[0]?.address || "";

			const devProject = (user.projects || []).find(
				(p) =>
					p.id === projectId &&
					["Desarrollador", "Creador"].includes(p.role),
			);

			const role = devProject?.role || "Desarrollador";

			return {
				id: user._id,
				name: fullName,
				email,
				role,
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

		const projectId = FlowRouter.getParam("id");

		const selectPrueba = event.target.selectPrueba.value;
		const developerEmail = event.target.developerEmail.value.trim();
		const fechaEstimada = event.target.fechaEstimada.value;
		const comments = event.target.commentModule.value;

		const imageDesarrollador = Session.get("imageTest");
		const imageToSend = imageDesarrollador || null;

		// 🔍 Buscar el dev por correo dentro del proyecto actual
		const dev = Meteor.users.findOne({
			"emails.address": developerEmail,
			projects: {
				$elemMatch: {
					id: projectId,
					role: { $in: ["Desarrollador", "Creador"] },
				},
			},
		});

		if (!dev) {
			console.log("[add_test_modal] Dev no encontrado para email:", developerEmail);
			yoloAlert("error", "No se encontró un desarrollador con ese correo en este proyecto.");
			return;
		}

		const developerId = dev._id;
		console.log("[add_test_modal] Dev seleccionado =>", {
			developerEmail,
			developerId,
		});

		Meteor.call(
			"add.proyect.test",
			projectId,
			selectPrueba,
			developerId, // 👈 seguimos mandando el _id al método
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

