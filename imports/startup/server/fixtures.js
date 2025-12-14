import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { Accounts } from "meteor/accounts-base";

import { Settings } from "../../api/settings/settings.js";

Meteor.startup(async () => {
	const adminUser = await Accounts.findUserByUsername("admin");

	if (!adminUser) {
		await Accounts.createUserAsync({
			username: "admin",
			email: "admin@admin.com",
			password: "j9kiJBXI2eNoj9kiJBXI2eNoj9kiJBXI2eNo",
			createdAt: new Date(),
			profile: {
				firstName: "Super",
				lastName: "Admin",
			},
		});
	}

	const rolesSettings = await Settings.findOneAsync({ _id: "roles" });

	if (!rolesSettings) {
		console.log("Inserting [Settings=Roles]");
		const today = new Date();

		const rolesArr = [
			{
				id: Random.id(),
				name: "Desarrollador",
				createdAt: today,
			},
			{
				id: Random.id(),
				name: "Tester",
				createdAt: today,
			},
		];

		await Settings.insertAsync({
			_id: "roles",
			roles: rolesArr,
		});
	}

	Accounts.urls.resetPassword = function (token) {
		return Meteor.absoluteUrl(`reset-password/${token}`);
	};

	Accounts.urls.enrollAccount = function (token) {
		return Meteor.absoluteUrl(`enroll-account/${token}`);
	};

	Accounts.urls.verifyEmail = function (token) {
		return Meteor.absoluteUrl(`verify-email/${token}`);
	};
});
