import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Settings } from "../settings.js";

if (Meteor.isServer) {
	// Setting privado (sólo usuario logueado)
	Meteor.publish("get.setting", function (selector) {
		if (!this.userId) {
			return this.ready();
		}

		check(selector, String);

		return Settings.find({ _id: selector });
	});

	// Setting público por id
	Meteor.publish("get.setting.public", function (selector) {
		check(selector, String);
		return Settings.find({ _id: selector });
	});

	// Todos los settings públicos
	Meteor.publish("settings.all.public", function () {
		return Settings.find({});
	});

	// Todos los settings (solo si está logueado)
	Meteor.publish("settings.all", function () {
		if (!this.userId) {
			return this.ready();
		}

		return Settings.find({});
	});

	// Roles (solo logueado)
	Meteor.publish("roles.all", function () {
		if (!this.userId) {
			return this.ready();
		}

		return Settings.find({ _id: "roles" });
	});
}
