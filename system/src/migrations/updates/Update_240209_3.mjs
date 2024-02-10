import { DishonoredUpdateBase } from "../DishonoredUpdateBase";

export default class Update_240209_3 extends DishonoredUpdateBase {

	static version = 240209.3;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "contact") return;

		const updateData = {
			"system.relationship": itemData.system.relationship.toLowerCase(),
			"system.-=relationships": null,
		};

		return updateData;
	}
}
