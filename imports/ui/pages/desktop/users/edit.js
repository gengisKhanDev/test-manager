import "./edit.html";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

import { Users } from "../../../../api/users/users.js";

Session.set("thisUser", {});

Template.desktop_users_edit.onCreated(function () {
	document.title = " - Edit User";
	Tracker.autorun(() => {
		this.subscribe("get.user", FlowRouter.getParam("id"));
		if (this.subscriptionsReady()) {
			Session.set("thisUser", Users.findOne({ _id: FlowRouter.getParam("id") }));
			if (Session.get("thisUser").profile) {
				initFlatpickr({
					selector: "#dob",
					defaultDate: Session.get("thisUser").profile.dob
				});
			};
		}
	});
});

Template.desktop_users_edit.onRendered(function () {
	initFormatName();
});

Template.desktop_users_edit.onDestroyed(function () {
	Session.set("thisUser", {});
});

Template.desktop_users_edit.helpers({
	thisUser() {
		return Session.get("thisUser");
	}
});

Template.desktop_users_edit.events({
	"submit #editUser"(event) {
		event.preventDefault();

		const name = event.target.name.value;
		const date = event.target.date.value;

		disableBtn("form", true);

		Meteor.call("edit.user", FlowRouter.getParam("id"), name, date,
			function (error, result) {
				if (error) {
					console.log(error);
					disableBtn("form", false, `<i class="fas fa-plus-square"></i> Edit`);
					yoloAlert("error");
				}
				else {
					disableBtn("form", false, `<i class="fas fa-plus-square"></i> Edit`);
					yoloAlert("success", "Edited Event!");
				}
			});
	}
});
