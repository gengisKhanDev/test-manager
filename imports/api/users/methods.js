import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { check } from "meteor/check";
import { Random } from "meteor/random";

import { Users } from "./users.js";

Meteor.methods({
	async "invite.user"(firstName, lastName, dob, email) {
		console.log("Ran Method [invite.user]", { firstName, lastName, dob, email });

		if (!this.userId) {
			throw new Meteor.Error("not-authorized", "Not authorized");
		}

		check(firstName, String);
		check(lastName, String);
		check(dob, String);
		check(email, String);

		const emailExists = await Users.findOneAsync({ "emails.address": email });
		if (emailExists) {
			throw new Meteor.Error(403, { message: "This email is already used" });
		}

		try {
			// 🔹 Meteor 3: usar la versión async
			const userId = await Accounts.createUserAsync({
				username: `${firstName}${lastName}_${Random.id()}`,
				dob: new Date(dob),
				email,
				password: Random.id(),
				profile: {
					firstName,
					lastName,
				},
			});

			console.log("[invite.user] created userId:", userId);

			const emailResult = await Accounts.sendEnrollmentEmail(userId, email);
			console.log("[invite.user] enrollment email sent:", emailResult);

			return { userId };
		} catch (error) {
			console.error("[invite.user] error:", error);
			throw new Meteor.Error(
				"invite-user-failed",
				error?.reason || error?.message || "Error creating user or sending email"
			);
		}
	},

	async "public.invite.user"(firstName, lastName, email) {
		console.log("Ran Method [public.invite.user]", {
			firstName,
			lastName,
			email,
		});

		check(firstName, String);
		check(lastName, String);
		check(email, String);

		const emailExists = await Users.findOneAsync({ "emails.address": email });
		if (emailExists) {
			throw new Meteor.Error(403, { message: "This email is already used" });
		}

		try {
			// 🔹 Meteor 3: versión async
			const userId = await Accounts.createUserAsync({
				username: `${firstName}${lastName}_${Random.id()}`,
				email,
				password: Random.id(),
				profile: {
					firstName,
					lastName,
				},
			});

			console.log("[public.invite.user] created userId:", userId);

			const emailResult = await Accounts.sendEnrollmentEmail(userId, email);
			console.log(
				"[public.invite.user] enrollment email sent:",
				emailResult
			);

			// mejor devolver algo explícito
			return { userId };
		} catch (error) {
			console.error("[public.invite.user] error:", error);
			throw new Meteor.Error(
				"public-invite-user-failed",
				error?.reason || error?.message || "Error creating user or sending email"
			);
		}
	},
});
