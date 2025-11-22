// imports/startup/client/desktop.js (o la ruta que uses)
import { Meteor } from "meteor/meteor";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

/* Layouts */
// Desktop
import "../../../ui/layouts/body/desktop.js";
// Global (si lo usas desde aquí)
import "../../../ui/layouts/body/global.js";

/* Components */
// Desktop
import "../../../ui/components/desktop/sidebar/sidebar.js";

// Global
import "../../../ui/components/global/loader/loader.js";
import "../../../ui/components/global/offline-alert/offline-alert.js";

/* Pages */
/// My Account
import "../../../ui/pages/desktop/my-account/my-account.js";
/// Notificacion
import "../../../ui/pages/desktop/notificacion/notificacion.js";
/// System Settings
import "../../../ui/pages/desktop/system-settings/system-settings.js";
/// Proyect Modal
import "../../../ui/pages/desktop/add-proyect-modal/add-proyect-modal.js";
import "../../../ui/pages/desktop/my-proyects/add-test-modal.js";

/// My Proyects
import "../../../ui/pages/desktop/my-proyects/my-proyects.js";

/// Users
import "../../../ui/pages/desktop/users/users.js";
import "../../../ui/pages/desktop/users/edit.js";

// 🔹 Ya NO usamos BlazeLayout.setRoot("body")
// 🔹 Ahora usamos this.render('layout', { navbar, sidebar, main, footer })

// Helper chiquito para no repetir lógica de auth + render
function renderDesktopIfLoggedIn(mainTemplate) {
	if (!Meteor.userId()) {
		FlowRouter.go("/");
		return;
	}

	this.render("desktop_body", {
		// navbar: "desktop_navbar", // si algún día tienes uno
		sidebar: "desktop_sidebar",
		main: mainTemplate,
	});
}

// My Account
FlowRouter.route("/my-account", {
	name: "desktop.my-account",
	action() {
		renderDesktopIfLoggedIn.call(this, "desktop_my_account");
	},
});

// System Settings
FlowRouter.route("/system-settings", {
	name: "desktop.system-settings",
	action() {
		renderDesktopIfLoggedIn.call(this, "desktop_system_settings");
	},
});

// Notificacion
FlowRouter.route("/notificacion", {
	name: "desktop.notificacion",
	action() {
		renderDesktopIfLoggedIn.call(this, "desktop_notificacion");
	},
});

// My proyects
FlowRouter.route("/proyect/:id", {
	name: "desktop.my-proyects",
	action(params) {
		// Si dentro del template usas FlowRouter.getParam('id'),
		// esto sigue funcionando igual.
		renderDesktopIfLoggedIn.call(this, "desktop_my_proyects");
	},
});

// Users list
FlowRouter.route("/users", {
	name: "desktop.users",
	action() {
		renderDesktopIfLoggedIn.call(this, "desktop_users");
	},
});

// Users edit
FlowRouter.route("/users/:id", {
	name: "desktop.users-edit",
	action(params) {
		renderDesktopIfLoggedIn.call(this, "desktop_users_edit");
	},
});
