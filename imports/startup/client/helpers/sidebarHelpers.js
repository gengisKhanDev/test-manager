import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Proyects } from '/imports/api/proyects/proyects.js';

Template.desktop_sidebar.helpers({
	myProyects() {
		return Proyects.find({ "createdBy.id": Meteor.userId() });
	},
	testerProyects() {
		return Proyects.find({ "team": { $elemMatch: { id: Meteor.userId(), role: "Tester" } } });
	},
	developerProyects() {
		return Proyects.find({ "team": { $elemMatch: { id: Meteor.userId(), role: "Desarrollador" } } });
	}
});

Template.registerHelper('getUserName', function (userId) {
	const user = Meteor.users.findOne({ _id: userId });
	return user && user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'Unknown';
});
