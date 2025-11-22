import { Users } from "./users.js";
import { Settings } from "../settings/settings.js";

import { check } from "meteor/check";
import { Random } from "meteor/random";

Meteor.methods({
	"invite.user"(firstName, lastName, dob, email) {
		console.log("Ran Method [invite.user]");

		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		check(firstName, String);
		check(lastName, String);
		check(dob, String);
		check(email, String);

		//check if email exists in DB
		const emailExists = Users.findOneAsync({ "emails.address": email });
		if (emailExists) {
			throw new Meteor.Error(403, { message: "This email is already used" });
		}

		const id = Accounts.createUser({
			username: firstName + lastName + "_" + Random.id(),
			dob: new Date(dob),
			email: email,
			password: Random.id(),
			profile: {
				firstName: firstName,
				lastName: lastName,
			}
		});

		Accounts.sendEnrollmentEmail(id, email);

		return id;
	},
	"public.invite.user"(firstName, lastName, email) {
		console.log("Ran Method [invite.user]");

		check(firstName, String);
		check(lastName, String);
		check(email, String);

		//check if email exists in DB
		const emailExists = Users.findOneAsync({ "emails.address": email });
		if (emailExists) {
			throw new Meteor.Error(403, { message: "This email is already used" });
		}

		const id = Accounts.createUser({
			username: firstName + lastName + "_" + Random.id(),
			email: email,
			password: Random.id(),
			profile: {
				firstName: firstName,
				lastName: lastName,
			}
		});

		Accounts.sendEnrollmentEmail(id, email);
	}
});
