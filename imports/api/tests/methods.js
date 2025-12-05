import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Random } from "meteor/random";

import { Tests } from "./tests.js";
import { Users } from "../users/users.js";
import { Proyects } from "../proyects/proyects.js";

const createdBy = require("../../startup/server/created-by.js");

Meteor.methods({
	async "add.proyect.test"(
		id,
		selectPrueba,
		selectDesarrollador,
		fechaEstimada,
		comments,
		imageObj,
	) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		check(id, String);
		check(selectPrueba, String);
		check(selectDesarrollador, String);
		check(fechaEstimada, String);
		check(comments, String);

		const testID = Random.id();

		// 👇 ahora sí usamos await
		const user = await Users.findOneAsync({ _id: selectDesarrollador });
		if (!user) {
			throw new Meteor.Error("user-not-found", "Developer not found");
		}

		const imagesArray = imageObj ? [imageObj] : [];
		const createdByUser = await createdBy.getUser(this.userId);

		await Tests.insertAsync({
			_id: testID,
			projectId: id,
			testType: selectPrueba,
			content: "",
			images: imagesArray,
			createdBy: createdByUser,
			createdAt: new Date(),
			status: "pending",
			assignedTo: {
				id: user._id,
				name: user.profile?.firstName || "Unknown",
			},
			development: {
				estimatedTime: new Date(fechaEstimada),
				actualTime: "",
				stages: false,
				resolution: {
					status: "unresolved",
					verifiedByTester: false,
					comments: comments,
				},
			},
		});

		await Proyects.updateAsync(
			{ _id: id },
			{
				$push: {
					tests: testID,
				},
			},
		);

		return testID;
	},

	async "tests.addDeveloperComments"(testId, quillText, imageOBJ) {
		check(testId, String);
		check(quillText, String);

		const test = await Tests.findOneAsync(testId);

		if (!test) {
			throw new Meteor.Error("Test not found");
		}

		const updateObject = {
			content: quillText,
			"development.stages": true,
			status: "pending review",
		};

		if (imageOBJ) {
			await Tests.updateAsync(testId, {
				$set: updateObject,
				$push: { images: imageOBJ },
			});
		} else {
			await Tests.updateAsync(testId, {
				$set: updateObject,
			});
		}
	},

	async "test.seguimientoAceptar"(testId, comments, imbOBJ) {
		check(testId, String);
		check(comments, String);

		const test = await Tests.findOneAsync(testId);
		if (!test) {
			throw new Meteor.Error("Test not found");
		}

		const updateObject = {
			"development.resolution.verifiedByTester": true,
			"development.resolution.status": "resolved",
			status: "resolved",
			"development.resolution.comments": comments,
		};

		if (imbOBJ) {
			await Tests.updateAsync(testId, {
				$set: updateObject,
				$push: { images: imbOBJ },
			});
		} else {
			await Tests.updateAsync(testId, {
				$set: updateObject,
			});
		}
	},

	async "test.rechazarAceptar"(testId, comments, imbOBJ) {
		check(testId, String);
		check(comments, String);

		const test = await Tests.findOneAsync(testId);
		if (!test) {
			throw new Meteor.Error("Test not found");
		}

		const updateObject = {
			"development.stages": false,
			status: "pending",
			"development.resolution.comments": comments,
		};

		if (imbOBJ) {
			await Tests.updateAsync(testId, {
				$set: updateObject,
				$push: { images: imbOBJ },
			});
		} else {
			await Tests.updateAsync(testId, {
				$set: updateObject,
			});
		}
	},
});
