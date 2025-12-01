// imports/ui/pages/users/users.js  (ajusta la ruta según tu estructura)
import "./users.html";

import { Template } from "meteor/templating";
import { Users } from "/imports/api/users/users.js";

Template.desktop_users.onCreated(function () {
	document.title = " - Users";

	this.subscribe("users.table");
});

Template.desktop_users.helpers({
	// Ya no usamos ReactiveVar manual. Meteor 3 nos da subscriptionsReady() reactivamente.
	isSubscriptionReady() {
		return Template.instance().subscriptionsReady();
	},

	// Ahora devolvemos directamente los documentos de la colección
	users() {
		return Users.find({}, { sort: { createdAt: -1 } });
	},
});
