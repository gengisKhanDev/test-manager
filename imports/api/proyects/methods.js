import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Random } from "meteor/random";

import { Proyects } from "./proyects.js";
import { Users } from "../users/users.js";
import { Settings } from "../settings/settings.js";

// Mantengo require porque ese módulo está en CommonJS
const createdBy = require("../../startup/server/created-by.js");

Meteor.methods({
	async "add.proyect"(proyectName, descriptionProyect) {
		check(proyectName, String);
		check(descriptionProyect, String);

		if (!this.userId) {
			throw new Meteor.Error("not-authorized", "Debes iniciar sesión para crear un proyecto");
		}

		const proyectID = Random.id();

		// 👇 AQUÍ va el await
		const createdByUser = await createdBy.getUser(this.userId);

		await Proyects.insertAsync({
			_id: proyectID,
			proyectName,
			descriptionProyect,
			createdBy: createdByUser,   // <- ahora sí tiene .id
			createdAt: new Date(),
		});

		await Users.updateAsync(
			{ _id: this.userId },
			{
				$addToSet: {
					projects: {
						id: proyectID,
						role: "Creador",
					},
				},
			},
		);

		return proyectID;
	},
});
