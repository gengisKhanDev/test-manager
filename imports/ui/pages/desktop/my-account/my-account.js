import "./my-account.html";

import { Settings } from "../../../../api/settings/settings";

Template.desktop_my_account.onCreated(function () {
	document.title = " - My Account";
	Tracker.autorun(() => {
		this.subscribe("settings.all");
		Session.set("user", Meteor.user());
	});
});

Template.desktop_my_account.onRendered(function () {
	initSelect2();
});

Template.desktop_my_account.helpers({
	user() {
		return Session.get("user");
	}
});

Template.desktop_my_account.events({
	"submit #myAccount"(event) {
		event.preventDefault();

		const firstName = event.target.firstName.value;
		const lastName = event.target.lastName.value;

		disableBtn("#editUserBtn", true);

		Meteor.call("edit.user", Meteor.userId(), firstName, lastName,
			roleId, function (error, result) {
				if (error) {
					console.log(error);
					disableBtn("#editUserBtn", false, `<i class="fas fa-plus-square"></i> Edit`);
					if (error.error === "invalid-action") {
						yoloAlert("error", error.reason);
					}
					else {
						yoloAlert("error");
					}
				}
				else {
					disableBtn("#editUserBtn", false, `<i class="fas fa-plus-square"></i> Edit`);
					yoloAlert("success", "Updated!");
				}
			});
	}
});
