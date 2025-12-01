import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Tests } from "../tests.js";

if (Meteor.isServer) {
	Meteor.publish("assignedTests", function () {
		if (!this.userId) {
			return this.ready();
		}

		return Tests.find({ "assignedTo.id": this.userId });
	});

	Meteor.publish("projectTests", function (projectId) {
		check(projectId, String);

		if (!this.userId) {
			return this.ready();
		}

		return Tests.find({ projectId });
	});

	Meteor.publish("assignedProjectTests", function (projectId, developerId) {
		check(projectId, String);
		check(developerId, String);

		if (!this.userId) {
			return this.ready();
		}

		// Aquí podrías reforzar lógica: solo ver tests si eres el dev asignado
		return Tests.find({
			projectId,
			"assignedTo.id": developerId,
		});
	});
}
