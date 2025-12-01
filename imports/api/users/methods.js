import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { check } from "meteor/check";
import { Random } from "meteor/random";

import { Users } from "./users.js";
import { Settings } from "../settings/settings.js"; // si lo usas en otros métodos

Meteor.methods({
	async "invite.user"(firstName, lastName, dob, email) {
		console.log("Ran Method [invite.user]");

		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}

		check(firstName, String);
		check(lastName, String);
		check(dob, String);
		check(email, String);

		const emailExists = await Users.findOneAsync({ "emails.address": email });
		if (emailExists) {
			throw new Meteor.Error(403, { message: "This email is already used" });
		}

		const id = Accounts.createUser({
			username: `${firstName}${lastName}_${Random.id()}`,
			dob: new Date(dob),
			email,
			password: Random.id(),
			profile: {
				firstName,
				lastName,
			},
		});

		Accounts.sendEnrollmentEmail(id, email);

		return id;
	},

	async "public.invite.user"(firstName, lastName, email) {
		console.log("Ran Method [public.invite.user]");

		check(firstName, String);
		check(lastName, String);
		check(email, String);

		const emailExists = await Users.findOneAsync({ "emails.address": email });
		if (emailExists) {
			throw new Meteor.Error(403, { message: "This email is already used" });
		}

		const id = Accounts.createUser({
			username: `${firstName}${lastName}_${Random.id()}`,
			email,
			password: Random.id(),
			profile: {
				firstName,
				lastName,
			},
		});

		Accounts.sendEnrollmentEmail(id, email);

		return id;
	},
});
