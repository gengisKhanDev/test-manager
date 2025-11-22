import "./login.html";

Template.global_login.onCreated(function () {
	document.title = " - Login";
});

Template.global_login.events({
	"click .input-group-text"() {
		const input = document.querySelector("#showHidePassword #password");
		const icon = document.querySelector("#showHidePassword .far");
		if (!input || !icon) return;

		if (input.type === "text") {
			input.type = "password";
			icon.classList.add("fa-eye-slash");
			icon.classList.remove("fa-eye");
		} else if (input.type === "password") {
			input.type = "text";
			icon.classList.remove("fa-eye-slash");
			icon.classList.add("fa-eye");
		}
	},

	"submit #login"(event) {
		event.preventDefault();
		const email = event.target.email.value;
		const password = event.target.password.value;

		disableBtn("form", true);

		Meteor.loginWithPassword(email, password, (error) => {
			const loginErrorDiv = document.getElementById("loginErrorDiv");
			const loginError = document.getElementById("loginError");

			if (error) {
				console.log(error);
				disableBtn("form", false, `Login`);
				yoloAlert("error", error.reason);

				if (loginErrorDiv && loginError) {
					loginErrorDiv.style.display = "block";
					loginError.textContent = error.reason;
				}
			} else {
				disableBtn("form", false, `Login`);

				if (loginErrorDiv) {
					loginErrorDiv.style.display = "none";
				}

				window.location.href = Meteor.absoluteUrl() + "my-account";
			}
		});
	},
});
