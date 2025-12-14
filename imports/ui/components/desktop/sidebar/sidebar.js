import "./sidebar.html";
import { Meteor } from "meteor/meteor";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Template } from "meteor/templating";
import { Modal } from "bootstrap";
import { Proyects } from "../../../../api/proyects/proyects.js";
import { Users } from "../../../../api/users/users.js";

Template.desktop_sidebar.onCreated(function () {
	this.autorun(() => {
		this.subscribe("projects.byCreatedById", Meteor.userId());
		this.subscribe("userProyects");
	});
});

Template.desktop_sidebar.helpers({
	getUserAvatar() {
		const thisUser = Users.findOne({});
		if (thisUser && thisUser.avatar) {
			return thisUser.avatar.type === "avatar"
				? thisUser.avatar.image
				: thisUser.avatar.base64;
		}
	},

	proyects() {
		return Proyects.find({}).fetch();
	},

	isActiveRoute(routeName) {
		return routeName === FlowRouter.getRouteName() ? "active" : "";
	},

	myProyects() {
		return Proyects.find({ "createdBy.id": Meteor.userId() });
	},
	testerProyects() {
		return Proyects.find({
			team: { $elemMatch: { id: Meteor.userId(), role: "Tester" } },
		});
	},
	developerProyects() {
		return Proyects.find({
			team: { $elemMatch: { id: Meteor.userId(), role: "Desarrollador" } },
		});
	},
});

Template.desktop_sidebar.events({
	"click .arrow"(event) {
		event.preventDefault();
		event.stopPropagation();

		const item = event.currentTarget.closest("li.list");
		if (!item) return;

		item.classList.toggle("show-menu");
	},

	"click #collapse"(event) {
		event.preventDefault();
		event.stopPropagation();

		const sidebar = document.querySelector(".desktop-body .sidebar");
		const main = document.querySelector(".desktop-body .main");
		if (!sidebar || !main) return;

		sidebar.classList.toggle("close");
		const isOpen = !sidebar.classList.contains("close");
		main.style.marginLeft = isOpen ? "260px" : "78px";
	},

	"click a.anchor"(event) {
		const href = event.currentTarget.getAttribute("href");
		if (!href || href === "#") {
			return;
		}
		event.preventDefault();
		FlowRouter.go(href);
	},

	"click #addProyect"(event) {
		event.preventDefault();
		event.stopPropagation();

		const modalEl = document.getElementById("addProyectModal");
		if (!modalEl) return;

		const modalInstance = Modal.getOrCreateInstance(modalEl);
		modalInstance.show();
	},

	"click #logout"(event) {
		event.preventDefault();
		event.stopPropagation();

		sourAlert(
			{
				type: "question",
				title: "Quieres cerrar sesión?",
				okButtonText: "Sí, cerrar sesión",
				cancelButtonText: "Cancelar",
			},
			(confirmed) => {
				if (!confirmed) return;

				Meteor.logout((err) => {
					if (err) {
						console.error("[logout] error:", err);
						yoloAlert("error", err.reason || "Error al cerrar sesión");
						return;
					}

					FlowRouter.go("/login");
				});
			},
		);
	},
});
