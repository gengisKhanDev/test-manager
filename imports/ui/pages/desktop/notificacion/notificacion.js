import "./notificacion.html";

import { Invitations } from "../../../../api/invitations/invitations.js";

Template.desktop_notificacion.onCreated(function () {
	document.title = " - My Account";
	this.autorun(() => {
		this.subscribe("settings.all");
		Session.set("user", Meteor.user());
		this.subscribe("userInvitations", Meteor.userId());
	});
});

Template.desktop_notificacion.onRendered(function () {
	initSelect2?.();
});

Template.desktop_notificacion.helpers({
	user() {
		return Session.get("user");
	},
	invitations() {
		return Invitations.find({
			"profile.id": Meteor.userId(),
			status: "pending",
		});
	},
});

Template.desktop_notificacion.events({
	"submit #myAccount"(event) {
		event.preventDefault();

		const firstName = event.target.firstName.value;
		const lastName = event.target.lastName.value;

		disableBtn("#editUserBtn", true);

		Meteor.call(
			"edit.user",
			Meteor.userId(),
			firstName,
			lastName,
			roleId,
			function (error, result) {
				if (error) {
					console.log(error);
					disableBtn(
						"#editUserBtn",
						false,
						`<i class="fas fa-plus-square"></i> Edit`,
					);
					if (error.error === "invalid-action") {
						yoloAlert("error", error.reason);
					} else {
						yoloAlert("error");
					}
				} else {
					disableBtn(
						"#editUserBtn",
						false,
						`<i class="fas fa-plus-square"></i> Edit`,
					);
					yoloAlert("success", "Updated!");
				}
			},
		);
	},

	"click .accept-invitation"(event) {
		event.preventDefault();
		const id = event.currentTarget.dataset.id;
		const proyectID = event.currentTarget.dataset.type;

		Meteor.call("accept-invitation", id, proyectID, function (error, result) {
			if (error) {
				console.log(error);
				if (error.error === "invalid-action") {
					yoloAlert("error", error.reason);
				} else {
					yoloAlert("error");
				}
			} else {
				yoloAlert("success", "Updated!");
			}
		});
	},

	"click .reject-invitation"(event) {
		event.preventDefault();
		const id = event.currentTarget.dataset.id;

		Meteor.call("reject-invitation", id, function (error, result) {
			if (error) {
				console.log(error);
				if (error.error === "invalid-action") {
					yoloAlert("error", error.reason);
				} else {
					yoloAlert("error");
				}
			} else {
				yoloAlert("success", "Updated!");
			}
		});
	},
});
