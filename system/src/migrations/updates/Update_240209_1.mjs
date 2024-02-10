import { DishonoredUpdateBase } from "../DishonoredUpdateBase";

export default class Update_240209_1 extends DishonoredUpdateBase {

	static version = 240209.1;

	async updateActor(actorData) {
		const updateData = {
			"system.stress.-=max": null,
		};

		if (actorData.type === "character") {
			// This value are dynamically calculated
			updateData["system.-=bonecharmequipped"] = null;
		}

		// Make sure all skill values are actual integers
		//
		const skillKeys = [
			"fight",
			"move",
			"study",
			"survive",
			"talk",
			"tinker",
		];

		for (const skillKey of skillKeys) {
			const value = actorData.system.skills[skillKey]?.value ?? 4;

			let newValue = parseInt(value);
			newValue = isNaN(newValue) ? 4 : newValue;

			updateData[`system.skills.${skillKey}.value`] = newValue;
			updateData[`system.skills.${skillKey}.-=label`] = null;
		}

		// Make sure all style values are actual integers
		//
		const styleKeys = [
			"boldly",
			"carefully",
			"cleverly",
			"forcefully",
			"quietly",
			"swiftly",
		];

		for (const styleKey of styleKeys) {
			const value = actorData.system.styles[styleKey]?.value ?? 4;

			let newValue = parseInt(value);
			newValue = isNaN(newValue) ? 4 : newValue;

			updateData[`system.styles.${styleKey}.value`] = newValue;
			updateData[`system.styles.${styleKey}.-=label`] = null;
		}

		return updateData;
	}

	async updateItem(itemData, actorData) {}
}
