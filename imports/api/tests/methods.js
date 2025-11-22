import { check } from "meteor/check";
import { Random } from "meteor/random";

import { Tests } from "./tests.js";
import { Users } from "../users/users.js";
import { Proyects } from "../proyects/proyects.js";

const createdBy = require("../../startup/server/created-by.js");

Meteor.methods({
	"add.proyect.test"(id, selectPrueba, selectDesarrollador, fechaEstimada, comments, imageObj) {
		const testID = Random.id();

		const user = Users.findOneAsync({ "_id": selectDesarrollador });

		const imagesArray = imageObj ? [imageObj] : [];

		Tests.insert({
			_id: testID,
			projectId: id,
			testType: selectPrueba,
			content: "",
			images: imagesArray,
			createdBy: createdBy.getUser(Meteor.userId()),
			createdAt: new Date(),
			status: "pending",
			assignedTo: {
				id: user._id,
				name: user.profile.firstName
			},
			development: {
				estimatedTime: new Date(fechaEstimada),
				actualTime: "",
				stages: false,
				resolution: {
					status: "unresolved",
					verifiedByTester: false,
					comments: comments
				}
			}
		});

		Proyects.update({ _id: id }, {
			$push: {
				tests: testID
			}
		});
		return testID;
	},
	'tests.addDeveloperComments'(testId, quillText, imageOBJ) {
		check(testId, String);

		const test = Tests.findOneAsync(testId);

		if (!test) {
			throw new Meteor.Error('Test not found');
		}

		let updateObject = {
			"content": quillText,
			'development.stages': true,
			'status': 'pending review'
		};

		if (imageOBJ) {
			Tests.update(testId, {
				$set: updateObject,
				$push: { "images": imageOBJ }
			});
		} else {
			Tests.update(testId, {
				$set: updateObject
			});
		}
	},
	'test.seguimientoAceptar'(testId, comments, imbOBJ) {
		check(testId, String);
		check(comments, String);
		const test = Tests.findOneAsync(testId);
		if (!test) {
			throw new Meteor.Error('Test not found');
		}

		let updateObject = {
			'development.resolution.verifiedByTester': true,
			'development.resolution.status': 'resolved',
			'status': 'resolved',
			'development.resolution.comments': comments
		};

		if (imbOBJ) {
			Tests.update(testId, {
				$set: updateObject,
				$push: { "images": imbOBJ }
			});
		} else {
			Tests.update(testId, {
				$set: updateObject
			});
		}
	},
	'test.rechazarAceptar'(testId, comments, imbOBJ) {
		check(testId, String);
		check(comments, String);
		const test = Tests.findOneAsync(testId);
		if (!test) {
			throw new Meteor.Error('Test not found');
		}

		let updateObject = {
			'development.stages': false,
			'status': 'pending',
			'development.resolution.comments': comments
		};

		if (imbOBJ) {
			Tests.update(testId, {
				$set: updateObject,
				$push: { "images": imbOBJ }
			});
		} else {
			Tests.update(testId, {
				$set: updateObject
			});
		}
	}

});
