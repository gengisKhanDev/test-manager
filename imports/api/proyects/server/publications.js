import { Proyects } from "../proyects.js";
import { Invitations } from "../../invitations/invitations.js";

import { check } from "meteor/check";

if (Meteor.isServer) {
	Meteor.publish("get.all-proyects", () => {
		return Proyects.find({});
	});

	Meteor.publish("projects.byCreatedById", function (createdById) {
		check(createdById, String);
		return Proyects.find(
			{ 'createdBy.id': createdById },
			{ fields: { proyectName: 1 } }
		);
	});

	Meteor.publish("get.proyect", function (id) {
		if (!this.userId) {
			return this.ready();
		}

		check(id, String);

		return Proyects.find({ _id: id });
	});

	Meteor.publish('userProyects', function () {
		if (!this.userId) {
			return this.ready();
		}
		return Proyects.find({
			$or: [
				{ "createdBy.id": this.userId },
				{ "team.id": this.userId }
			]
		});
	});

	Meteor.publish("invitations.byProyect", function (proyectId) {
		return Invitations.find({ "proyect._id": proyectId });
	});

	Meteor.publish('projectDevelopers', function (projectId) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		return Proyects.find(
			{ _id: projectId },
			{
				fields: {
					team: 1
				}
			}
		);
	});

	Meteor.publish('projectUsers', function (projectId) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const project = Proyects.findOneAsync({ _id: projectId });
		if (project && project.team) {
			const userIds = project.team.map(member => member.id);
			return Meteor.users.find({ _id: { $in: userIds } }, {
				fields: {
					profile: 1
				}
			});
		}
		return this.ready();
	});

}
