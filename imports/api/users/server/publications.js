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

	Meteor.publish("users.all", function () {
		if (!this.userId) {
			return this.ready();
		}

		return Users.find({});
	});

	Meteor.publish("get.users.by.company", function (id) {
		check(id, String);

		if (!this.userId) {
			return this.ready();
		}

		return Users.find({ "profile.company.id": id });
	});

	Meteor.publish("get.user", function (id) {
		check(id, String);

		if (!this.userId) {
			return this.ready();
		}

		return Users.find({ _id: id });
	});
}
