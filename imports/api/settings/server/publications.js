import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Settings } from "../settings.js";

if (Meteor.isServer) {
	Meteor.publish("get.setting", function (selector) {
		if (!this.userId) {
			return this.ready();
		}

		check(selector, String);

		return Settings.find({ _id: selector });
	});

	Meteor.publish("get.setting.public", function (selector) {
		check(selector, String);
		return Settings.find({ _id: selector });
	});

	Meteor.publish("settings.all.public", function () {
		return Settings.find({});
	});

	Meteor.publish("settings.all", function () {
		if (!this.userId) {
			return this.ready();
		}

		return Settings.find({});
	});

	Meteor.publish("roles.all", function () {
		if (!this.userId) {
			return this.ready();
		}

		return Settings.find({ _id: "roles" });
	});
}
