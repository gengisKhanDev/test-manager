import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

import { Proyects } from "../proyects.js";
import { Invitations } from "../../invitations/invitations.js";

if (Meteor.isServer) {
	Meteor.publish("projectDevelopersUsers", function (projectId) {
		if (!this.userId) {
			return this.ready();
		}

		check(projectId, String);

		console.log("[pub projectDevelopersUsers] projectId =>", projectId);

		return Meteor.users.find(
			{
				projects: {
					$elemMatch: {
						id: projectId,
						role: { $in: ["Desarrollador"] },
					},
				},
			},
			{
				fields: {
					profile: 1,
					projects: 1,
					username: 1,
					emails: 1,
				},
			},
		);
	});


	Meteor.publish("get.all-proyects", function () {
		return Proyects.find({});
	});

	Meteor.publish("projects.byCreatedById", function (createdById) {
		check(createdById, String);
		return Proyects.find(
			{ "createdBy.id": createdById },
			{ fields: { proyectName: 1 } },
		);
	});

	Meteor.publish("get.proyect", function (id) {
		if (!this.userId) {
			return this.ready();
		}

		check(id, String);

		return Proyects.find({ _id: id });
	});

	Meteor.publish("userProyects", function () {
		if (!this.userId) {
			return this.ready();
		}

		return Proyects.find({
			$or: [{ "createdBy.id": this.userId }, { "team.id": this.userId }],
		});
	});

	Meteor.publish("invitations.byProyect", function (proyectId) {
		check(proyectId, String);
		return Invitations.find({ "proyect._id": proyectId });
	});
}
