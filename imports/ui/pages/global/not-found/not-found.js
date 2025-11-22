import "./not-found.html";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

Template.not_found.onCreated(function () {
	document.title = " - 404";
});

Template.not_found.events({
	"click #home"() {
		if (Meteor.userId()) {
			FlowRouter.go("/my-account");
		}
		else {
			FlowRouter.go("/");
		}
	}
});
