import { check } from "meteor/check";
import { Random } from "meteor/random";

import { Invitations } from "./invitations.js";
import { Users } from "../users/users.js";
import { Settings } from "../settings/settings.js";
import { Proyects } from "../proyects/proyects.js";

const createdBy = require("../../startup/server/created-by.js");

Meteor.methods({
	"add.users-proyect"(id, roleID, email) {

		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		check(id, String);
		check(email, String);
		check(roleID, String);

		const emailExists = Users.findOneAsync({ "emails.address": email });
		if (!emailExists) {
			throw new Meteor.Error(403, { message: "This email dont exist" });
		}

		const roles = Settings.findOneAsync({ _id: "roles" }).roles;
		let thisRole = {};
		roles.forEach((role, index) => {
			if (role.id === roleID) {
				thisRole = role;
			}
		});

		const proyects = Proyects.findOneAsync({ _id: id }, {
			fields: {
				_id: 1,
				proyectName: 1
			}
		});

		Invitations.insert({
			proyect: proyects,
			profile: {
				id: emailExists._id,
				firstName: emailExists.profile.firstName,
				lastName: emailExists.profile.lastName
			},
			email: email,
			status: "pending",
			role: {
				id: thisRole.id,
				name: thisRole.name
			},
			createdBy: createdBy.getUser(Meteor.userId()),
			createdAt: new Date()
		});
	},
	"accept-invitation"(invitationID, proyectID) {
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		const invitation = Invitations.findOneAsync({ _id: invitationID });
		if (!invitation) {
			throw new Meteor.Error(404, "Invitation not found");
		}

		Invitations.update({ _id: invitationID }, {
			$set: {
				status: "accepted"
			}
		});

		Proyects.update({ _id: proyectID }, {
			$addToSet: {
				team: {
					id: invitation.profile.id,
					role: invitation.role.name
				}
			}
		});

		Users.update({ _id: invitation.profile.id }, {
			$addToSet: {
				projects: {
					id: proyectID,
					role: invitation.role.name
				}
			}
		});

	},
	"reject-invitation"(invitationID) {

		Invitations.update({ "_id": invitationID }, {
			$set: {
				"status": "rejected"
			}
		});
	}
});
