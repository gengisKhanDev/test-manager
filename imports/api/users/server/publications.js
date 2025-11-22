// imports/api/users/server/publications.js
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Users } from "../users.js";

if (Meteor.isServer) {
	Meteor.publish("users.table", function () {
		if (!this.userId) {
			return this.ready();
		}

		return Users.find(
			{},
			{
				fields: {
					_id: 1,
					"profile.firstName": 1,
					"profile.lastName": 1,
					createdAt: 1,
				},
			},
		);
	});

	// El resto lo dejamos igual por ahora (luego los modernizamos si quieres)
	Meteor.publish("users.all", () => {
		if (Meteor.userId()) {
			return Users.find({});
		} else {
			return [];
		}
	});

	Meteor.publish("get.users.by.company", (id) => {
		check(id, String);

		if (Meteor.userId()) {
			return Users.find({ "profile.company.id": id });
		} else {
			return [];
		}
	});

	Meteor.publish("get.user", (id) => {
		if (Meteor.userId()) {
			return Users.find({ _id: id });
		} else {
			return [];
		}
	});
}
