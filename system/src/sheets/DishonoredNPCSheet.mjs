import DishonoredBaseActorSheet from "./DishonoredBaseActorSheet.mjs";

export default class DishonoredNPCSheet extends DishonoredBaseActorSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: [
				"dishonored",
				"sheet",
				"actor",
				"npc",
			],
			height: 700,
		});
	}

}
