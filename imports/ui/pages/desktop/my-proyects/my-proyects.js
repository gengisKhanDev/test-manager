import "./my-proyects.html";

import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Proyects } from "../../../../api/proyects/proyects.js";
import { Invitations } from "../../../../api/invitations/invitations.js";
import { Settings } from "../../../../api/settings/settings.js";
import { Tests } from "../../../../api/tests/tests.js";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Tracker } from "meteor/tracker";
import { Session } from "meteor/session";
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

let quillEditors = {};

Template.desktop_my_proyects.onCreated(function () {
	document.title = " - My Account";
	this.autorun(() => {
		const projectId = FlowRouter.getParam("id");
		this.subscribe("settings.all");
		this.subscribe("get.proyect", projectId);
		this.subscribe("invitations.byProyect", projectId);
		this.subscribe("assignedTests");
		this.subscribe("projectTests", projectId);
		this.subscribe("assignedProjectTests", projectId, Meteor.userId());
		this.subscribe("projectUsers", projectId);
	});
});

Template.desktop_my_proyects.onRendered(function () {
	initSelect2?.();

	this.autorun(() => {
		if (Template.instance().subscriptionsReady()) {
			const projectId = FlowRouter.getParam("id");
			const tests = Tests.find({ projectId }).fetch();

			const proyect = Proyects.findOne({ _id: projectId })?.proyectName;
			if (proyect) {
				Session.set("todoelproyect", proyect);
			}

			tests.forEach((test) => {
				const selector = `#quillEditorContainer-${test._id}`;
				const content = test.content || "";
				initQuillEditor(selector, content, test._id);
			});
		}
	});
});

Template.desktop_my_proyects.helpers({
	proyects() {
		return Proyects.find({ _id: FlowRouter.getParam("id") }).fetch();
	},
	roles() {
		const rolesDoc = Settings.findOne({ _id: "roles" });
		return rolesDoc?.roles;
	},
	teamMembers() {
		const projectId = FlowRouter.getParam("id");
		const project = Proyects.findOne({ _id: projectId });
		if (project && project.team) {
			const invitations = Invitations.find({ "proyect._id": projectId }).fetch();
			return project.team.map((member) => {
				const user = Meteor.users.findOne({ _id: member.id });
				const invitation = invitations.find(
					(invite) => invite.profile.id === member.id,
				);
				return {
					...member,
					status: invitation ? invitation.status : "accepted",
					profile: user ? user.profile : {},
					role: member.role,
				};
			});
		}
		return [];
	},
	hasRole(role) {
		const userId = Meteor.userId();
		const projectId = FlowRouter.getParam("id");
		const user = Meteor.user();

		if (user && Array.isArray(user.projects)) {
			const userProject = user.projects.find((p) => p.id === projectId);
			if (userProject && userProject.role === role) {
				return true;
			}
		}

		const project = Proyects.findOne({ _id: projectId, "team.id": userId });
		if (project && Array.isArray(project.team)) {
			const teamMember = project.team.find((member) => member.id === userId);
			if (teamMember && teamMember.role === role) {
				return true;
			}
		}

		if (
			project &&
			project.createdBy &&
			project.createdBy.id === userId &&
			role === "Creador"
		) {
			return true;
		}

		return false;
	},

	isNotRole(role) {
		const userId = Meteor.userId();
		const projectId = FlowRouter.getParam("id");
		const user = Meteor.user();

		if (user && Array.isArray(user.projects)) {
			const userProject = user.projects.find((p) => p.id === projectId);
			if (userProject && userProject.role === role) {
				return false;
			}
		}

		const project = Proyects.findOne({ _id: projectId, "team.id": userId });
		if (project && Array.isArray(project.team)) {
			const teamMember = project.team.find((member) => member.id === userId);
			if (teamMember && teamMember.role === role) {
				return false;
			}
		}

		if (
			project &&
			project.createdBy &&
			project.createdBy.id === userId &&
			role === "Creador"
		) {
			return false;
		}

		return true;
	},
	testsForTester() {
		const projectId = FlowRouter.getParam("id");
		return Tests.find({ projectId, "createdBy.id": Meteor.userId() });
	},
	testsForDeveloper() {
		const projectId = FlowRouter.getParam("id");
		const developerId = Meteor.userId();
		return Tests.find({ projectId, "assignedTo.id": developerId });
	},
	testStatus(status) {
		if (status === "pending") {
			return "Pendiente";
		} else if (status === "pending review") {
			return "Pendiente de Revision";
		} else {
			return "Resuelto";
		}
	},
	allTestsForProject() {
		const projectId = FlowRouter.getParam("id");
		return Tests.find({ projectId }).fetch();
	},
});

Template.desktop_my_proyects.events({
	"click .close-icon"(event) {
		event.preventDefault();
		const col = event.currentTarget.closest(".col");
		if (col && col.parentNode) {
			col.parentNode.removeChild(col);
		}
	},
	"click .btn-aceptarSeguimiento"(event) {
		event.preventDefault();
		const accordionBody = event.currentTarget.closest(".accordion-body");
		const textarea = accordionBody?.querySelector(".commentsErrores");
		const comentario = textarea?.value || "";
		const id = event.currentTarget.dataset.id;
		const imageDesarrollador = Session.get("devueltaImage");
		const imageToSend = imageDesarrollador || null;

		Meteor.call(
			"test.seguimientoAceptar",
			id,
			comentario,
			imageToSend,
			(error) => {
				if (error) {
					console.log(error);
					if (error.error) {
						yoloAlert("error", error.reason.message);
					} else {
						yoloAlert("error");
					}
				} else {
					yoloAlert("success", "Actualizado!");
				}
			},
		);
	},
	"click .btn-rechazarSeguimiento"(event) {
		event.preventDefault();
		const accordionBody = event.currentTarget.closest(".accordion-body");
		const textarea = accordionBody?.querySelector(".commentsErrores");
		const comentario = textarea?.value || "";
		const id = event.currentTarget.dataset.id;
		const imageDesarrollador = Session.get("devueltaImage");
		const imageToSend = imageDesarrollador || null;

		Meteor.call(
			"test.rechazarAceptar",
			id,
			comentario,
			imageToSend,
			(error) => {
				if (error) {
					console.log(error);
					if (error.error) {
						yoloAlert("error", error.reason.message);
					} else {
						yoloAlert("error");
					}
				} else {
					yoloAlert("success", "Actualizado!");
				}
			},
		);
	},
	"submit #enviarInvitacion"(event) {
		event.preventDefault();

		const email = event.target.email.value;
		const roleId = event.target.roleId.value;

		Meteor.call(
			"add.users-proyect",
			FlowRouter.getParam("id"),
			roleId,
			email,
			function (error, result) {
				if (error) {
					console.log(error);
					if (error.error) {
						yoloAlert("error", error.reason?.message || error.reason || "Error");
					} else {
						yoloAlert("error");
					}
				} else {
					yoloAlert("success", "Invitación enviada!");
				}
			},
		);
	},
	"change #desarrolladorImage .file"(event) {
		uploadImage({ text: "Drag and Drop Image" }, event, function (fileObject) {
			yoloAlert("success", "Imagen Agregada!");
			Session.set("imageDesarrollador", fileObject);
		});
	},
	"change #devueltaImage .file"(event) {
		uploadImage({ text: "Drag and Drop Image" }, event, function (fileObject) {
			yoloAlert("success", "Imagen Agregada!");
			Session.set("devueltaImage", fileObject);
		});
	},
	"submit #developerComments"(event, instance) {
		event.preventDefault();

		const id = event.currentTarget.dataset.id;
		const imageDesarrollador = Session.get("imageDesarrollador");
		const imageToSend = imageDesarrollador ? imageDesarrollador : null;

		Meteor.call(
			"tests.addDeveloperComments",
			id,
			getQuillEditorContent(id),
			imageToSend,
			(error, result) => {
				if (error) {
					console.error("Error adding developer comments:", error);
				} else {
					console.log("Developer comments added:", result);
				}
			},
		);
	},
	"click #downloadGuidePdf"(event, instance) {
		event.preventDefault();
		generateGuidePdf();
	},
	"click .PDFInformeTest"(event) {
		event.preventDefault();
		const testId = event.currentTarget.dataset.id;
		const test = Tests.findOne(testId);
		const titleProyect = Session.get("todoelproyect");

		if (test) {
			generateDynamicPdf(test, titleProyect);
		} else {
			console.error("Test not found:", testId);
		}
	}
});

const initQuillEditor = (selector, html = "", testId) => {
	Tracker.afterFlush(() => {
		const container = document.querySelector(selector);
		if (!container) return;

		if (container.querySelector(".ql-container")) return;

		const quillEditor = new Quill(container, {
			theme: "snow",
			placeholder: "Write description",
			modules: {
				toolbar: [
					["bold", "italic", "underline", "strike"],
					["blockquote", "code-block"],
					[{ header: 1 }, { header: 2 }, { header: 3 }],
					[{ list: "ordered" }, { list: "bullet" }],
					[{ script: "sub" }, { script: "super" }],
					[{ indent: "-1" }, { indent: "+1" }],
					[{ direction: "rtl" }],
					[{ size: ["small", false, "large", "huge"] }],
					[{ header: [1, 2, 3, 4, 5, 6, false] }],
					[{ color: [] }, { background: [] }],
					[{ font: [] }],
					[{ align: [] }],
					["clean"],
				],
			},
		});

		if (html && html !== "undefined") {
			const delta = quillEditor.clipboard.convert(html);
			quillEditor.setContents(delta, "silent");
		}

		quillEditors[testId] = quillEditor;
	});
};

const getQuillEditorContent = (testId) => {
	const quillEditor = quillEditors[testId];
	return quillEditor ? quillEditor.root.innerHTML : "";
};
