import { Invitations } from "../invitations.js";

import { check } from "meteor/check";

if (Meteor.isServer) {

	Meteor.publish('userInvitations', function (id) {
		return Invitations.find({
			'profile.id': id,
			status: 'pending',
		});
	});
}