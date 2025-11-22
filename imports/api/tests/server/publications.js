import { Tests } from "../tests.js";

import { check } from "meteor/check";

if (Meteor.isServer) {

	Meteor.publish('assignedTests', function () {
		return Tests.find({ 'assignedTo.id': Meteor.userId() });
	});
	Meteor.publish('projectTests', function (projectId) {
		check(projectId, String);
		return Tests.find({ projectId });
	});

	Meteor.publish('assignedProjectTests', function (projectId, developerId) {
		check(projectId, String);
		check(developerId, String);
		return Tests.find({ projectId, 'assignedTo.id': developerId });
	});
}
