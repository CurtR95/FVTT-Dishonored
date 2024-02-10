import { DishonoredUpdateBase } from "../DishonoredUpdateBase";

export default class Update_240209_2 extends DishonoredUpdateBase {

	static version = 240209.2;

	async updateActor(actorData) {
		if (actorData.type !== "npc") return;

		const updateData = {
			"system.type": actorData.system.type.toLowerCase(),
			"system.-=types": null,
		};

		return updateData;
	}
}
