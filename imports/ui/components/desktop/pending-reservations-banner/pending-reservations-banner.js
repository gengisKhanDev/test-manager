import "./pending-reservations-banner.html";

import { Reservations } from "../../../../api/reservations/reservations.js";

Template.desktop_pending_reservations_banner.onCreated(function () {
	Tracker.autorun(() => {
		this.subscribe("get.pending.reservations");
	});
});

Template.desktop_pending_reservations_banner.helpers({
	pendingReservations() {
		return Reservations.find({
			status: {
				$eq: "Pending"
			}
		}).countAsync();
	}
});