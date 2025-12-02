// imports/api/proyects/server/publications.js
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
						role: "Desarrollador",
					},
				},
			},
			{
				fields: {
					profile: 1,
					projects: 1,
					username: 1,
				},
			},
		);
	});

	// Lista completa de proyectos
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
	// OJO: aunque ahora muchos proyectos no tengan `team`,
	// esta parte no rompe nada, simplemente no matchea.
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

	// ⚠️ Estos dos ya NO los necesitamos para el select de desarrolladores.
	// Puedes dejarlos si en otro lado sigues usando `team`,
	// o eliminarlos si no los usas en ningún sitio.

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

	// Usuarios (Meteor.users) que pertenecen al equipo de un proyecto,
	// basado en `project.team`.
	Meteor.publish("projectUsers", async function (projectId) {
		if (!this.userId) {
			return this.ready();
		}

		check(projectId, String);

		const project = await Proyects.findOneAsync({ _id: projectId });

		if (!project || !project.team) {
			return this.ready();
		}

		const userIds = project.team
			.map((member) => member.id)
			.filter(Boolean);

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
