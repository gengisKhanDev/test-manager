import "./users.html";

import { Template } from "meteor/templating";
import { Users } from "/imports/api/users/users.js";

Template.desktop_users.onCreated(function () {
	document.title = " - Users";

	this.subscribe("users.table");
});

Template.desktop_users.helpers({
	isSubscriptionReady() {
		return Template.instance().subscriptionsReady();
	},

	users() {
		return Users.find({}, { sort: { createdAt: -1 } });
	},
});
