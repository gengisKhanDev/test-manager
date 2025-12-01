import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

import { Proyects } from "../proyects.js";
import { Invitations } from "../../invitations/invitations.js";

if (Meteor.isServer) {
	// Lista completa de proyectos (mantengo pública como la tenías)
	Meteor.publish("get.all-proyects", function () {
		return Proyects.find({});
	});

	// Proyectos creados por un usuario (solo nombre)
	Meteor.publish("projects.byCreatedById", function (createdById) {
		check(createdById, String);
		return Proyects.find(
			{ "createdBy.id": createdById },
			{ fields: { proyectName: 1 } },
		);
	});

	// Un proyecto específico (solo si está logueado)
	Meteor.publish("get.proyect", function (id) {
		if (!this.userId) {
			return this.ready();
		}

		check(id, String);

		return Proyects.find({ _id: id });
	});

	// Todos los proyectos donde participa el usuario (creador o team)
	Meteor.publish("userProyects", function () {
		if (!this.userId) {
			return this.ready();
		}

		return Proyects.find({
			$or: [{ "createdBy.id": this.userId }, { "team.id": this.userId }],
		});
	});

	// Invitaciones de un proyecto
	Meteor.publish("invitations.byProyect", function (proyectId) {
		check(proyectId, String);
		return Invitations.find({ "proyect._id": proyectId });
	});

	// Solo el campo team del proyecto (para saber miembros/roles)
	Meteor.publish("projectDevelopers", function (projectId) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		check(projectId, String);

		return Proyects.find(
			{ _id: projectId },
			{
				fields: {
					team: 1,
				},
			},
		);
	});

	// Usuarios (Meteor.users) que pertenecen al equipo de un proyecto
	Meteor.publish("projectUsers", async function (projectId) {
		if (!this.userId) {
			return this.ready();
		}

		check(projectId, String);

		// Versión moderna: findOneAsync
		const project = await Proyects.findOneAsync({ _id: projectId });

		if (!project || !project.team) {
			return this.ready();
		}

		const userIds = project.team
			.map((member) => member.id)
			.filter(Boolean); // limpia undefined / null

		return Meteor.users.find(
			{ _id: { $in: userIds } },
			{
				fields: {
					profile: 1,
				},
			},
		);
	});
}
