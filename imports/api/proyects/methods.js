import { check } from "meteor/check";
import { Random } from "meteor/random";

import { Proyects } from "./proyects.js";
import { Users } from "../users/users.js";
import { Settings } from "../settings/settings.js";

const createdBy = require("../../startup/server/created-by.js");

Meteor.methods({
	"add.proyect"(proyectName, descriptionProyect) {
		const proyectID = Random.id();

		Proyects.insert({
			_id: proyectID,
			proyectName: proyectName,
			descriptionProyect: descriptionProyect,
			createdBy: createdBy.getUser(Meteor.userId()),
			createdAt: new Date()
		});

		Users.update({ _id: Meteor.userId() }, {
			$addToSet: {
				projects: {
					id: proyectID,
					role: "Creador"
				}
			}
		});
	}
});
