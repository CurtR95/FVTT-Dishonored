import { DishonoredUpdateBase } from "../DishonoredUpdateBase";

export default class Update_240210_1 extends DishonoredUpdateBase {

	static version = 240210.1;

	async updateItem(itemData, actorData) {
		const updateData = {};

		if (itemData.img === "systems/FVTT-Dishonored/icons/focuses/Natural%20Philosophy.svg") {
			updateData.img = "systems/FVTT-Dishonored/icons/focuses/NaturalPhilosophy.svg";
		}

		if (itemData.img === "systems/FVTT-Dishonored/icons/focuses/Void%20Lore.webp") {
			updateData.img = "systems/FVTT-Dishonored/icons/focuses/VoidLore.webp";
		}

		return updateData;
	}
}
