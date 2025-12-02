import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Random } from "meteor/random";

import { Invitations } from "./invitations.js";
import { Users } from "../users/users.js";
import { Settings } from "../settings/settings.js";
import { Proyects } from "../proyects/proyects.js";

const createdBy = require("../../startup/server/created-by.js");

Meteor.methods({
	async "add.users-proyect"(id, roleID, email) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		check(id, String);
		check(email, String);
		check(roleID, String);

		// 1) Buscar usuario por email (async)
		const emailExists = await Users.findOneAsync({ "emails.address": email });
		if (!emailExists) {
			throw new Meteor.Error(403, { message: "This email dont exist" });
		}

		// 2) Obtener roles desde Settings (async)
		const rolesDoc = await Settings.findOneAsync({ _id: "roles" });

		if (!rolesDoc || !Array.isArray(rolesDoc.roles)) {
			throw new Meteor.Error(
				"roles-not-configured",
				"Roles configuration not found"
			);
		}

		const roles = rolesDoc.roles;

		// 3) Buscar el rol seleccionado
		const thisRole = roles.find((role) => role.id === roleID);

		if (!thisRole) {
			throw new Meteor.Error("invalid-role", "Selected role does not exist");
		}

		// 4) Obtener info básica del proyecto (async)
		const proyect = await Proyects.findOneAsync(
			{ _id: id },
			{
				fields: {
					_id: 1,
					proyectName: 1,
				},
			}
		);

		if (!proyect) {
			throw new Meteor.Error("project-not-found", "Project not found");
		}

		// 5) createdBy moderno (puede ser sync o async; await soporta ambos)
		const createdByUser = await createdBy.getUser(this.userId);

		// 6) Insertar invitación (mejor usar insertAsync en Meteor 3)
		await Invitations.insertAsync({
			proyect,
			profile: {
				id: emailExists._id,
				firstName: emailExists.profile.firstName,
				lastName: emailExists.profile.lastName,
			},
			email,
			status: "pending",
			role: {
				id: thisRole.id,
				name: thisRole.name,
			},
			createdBy: createdByUser,
			createdAt: new Date(),
		});

		// Opcional: devolver algo útil al cliente
		return { ok: true };
	},
	async "accept-invitation"(invitationID, proyectID) {
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		const invitation = await Invitations.findOneAsync({ _id: invitationID });
		if (!invitation) {
			throw new Meteor.Error(404, "Invitation not found");
		}

		await Invitations.updateAsync({ _id: invitationID }, {
			$set: {
				status: "accepted"
			}
		});

		await Proyects.updateAsync({ _id: proyectID }, {
			$addToSet: {
				team: {
					id: invitation.profile.id,
					role: invitation.role.name
				}
			}
		});

		await Users.updateAsync({ _id: invitation.profile.id }, {
			$addToSet: {
				projects: {
					id: proyectID,
					role: invitation.role.name
				}
			}
		});

	},
	"reject-invitation": async function (invitationID) {

		await Invitations.updateAsync({ "_id": invitationID }, {
			$set: {
				"status": "rejected"
			}
		});
	}
});
