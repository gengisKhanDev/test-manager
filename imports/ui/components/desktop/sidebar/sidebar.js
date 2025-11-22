// imports/ui/components/desktop/sidebar/sidebar.js
import "./sidebar.html";
import { Meteor } from "meteor/meteor";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Template } from "meteor/templating";
import { Modal } from "bootstrap"; // 👈 NUEVO

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
});
Template.desktop_sidebar.events({
	"click .arrow"(event) {
		const arrowParent = event.currentTarget.closest(".menu-item, li, div");
		if (arrowParent) {
			arrowParent.classList.toggle("show-menu");
		}
	},

	"click #collapse"() {
		const sidebar = document.querySelector(".desktop-body .sidebar");
		const main = document.querySelector(".desktop-body .main");
		if (!sidebar || !main) return;

		sidebar.classList.toggle("close");
		const isOpen = !sidebar.classList.contains("close");
		main.style.marginLeft = isOpen ? "260px" : "78px";
	},

	"click #addProyect"() {
		const modal = document.getElementById("addProyectModal");
		if (modal && typeof bootstrap !== "undefined") {
			const bsModal = new bootstrap.Modal(modal);
			bsModal.show();
		}
	},

	// 👇 NUEVA VERSIÓN DEL LOGOUT (sin sourAlert)
	"click #logout"(event) {
		event.preventDefault();

		const confirmLogout = window.confirm("¿Seguro que quieres cerrar sesión?");
		if (!confirmLogout) return;

		Meteor.logout((err) => {
			if (err) {
				console.error("[logout] error:", err);
				// Si quieres: yoloAlert("error", err.reason || "Error al cerrar sesión");
				return;
			}

			// Redirige siempre al login
			FlowRouter.go("/login");
		});
	},
});
