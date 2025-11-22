import "./sign-up.html";

Template.global_sign_up.onCreated(function () {
	document.title = "  - Sign Up";
});

Template.global_sign_up.onRendered(function () {
	initFormatName();
	initFlatpickr({
		selector: "#dob",
		maxDate: "today"
	});
});

Template.global_sign_up.events({
	"submit #addUser"(event) {
		event.preventDefault();

		const firstName = event.target.firstName.value;
		const lastName = event.target.lastName.value;
		const email = event.target.email.value;

		disableBtn("#addUserBtn", true);

		Meteor.call(
			"public.invite.user",
			firstName,
			lastName,
			email,
			function (error, result) {
				if (error) {
					console.log(error);
					if (error.error) {
						yoloAlert("error", error.reason.message);
					} else {
						yoloAlert("error");
					}
					disableBtn("#addUserBtn", false, "<i class='fas fa-plus-square'></i> Add");
				} else {
					const form = document.getElementById("addUser");
					if (form) form.reset();
					disableBtn("#addUserBtn", false, "<i class='fas fa-plus-square'></i> Add");
					yoloAlert("success", "Please check your email!");
				}
			}
		);
	}
});
