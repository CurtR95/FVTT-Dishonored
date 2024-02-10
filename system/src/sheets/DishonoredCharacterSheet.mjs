// import { DishonoredSharedActorFunctions } from "../documents/DishonoredActor.mjs";
import DishonoredBaseActorSheet from "./DishonoredBaseActorSheet.mjs";

export default class DishonoredCharacterSheet extends DishonoredBaseActorSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: [
				"dishonored",
				"sheet",
				"actor",
				"character",
			],
			height: 800,
		});
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// -------------------------------------------------------------
		// ! Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		// Experience track
		html.find("[id^=\"exp\"]").click(
			event => this._updateFromClickedTrack(event)
		);

		// Void track
		html.find("[id^=\"void\"]").click(
			event => this._updateFromClickedTrack(event)
		);

		html.find("#decrease-void-max").click(() => this.actor.adjustVoidMax(-1));
		html.find("#increase-void-max").click(() => this.actor.adjustVoidMax(1));
	}

	/** @override */
	async getData() {
		const context = await super.getData();

		context.bonecharmsEquipped = this.actor.bonecharmsEquippedCount;

		// Populate status of values on the XP track to make rendering it more
		// efficient
		//
		context.maxXP = game.settings.get(SYSTEM_ID, "maxNumberOfExperience");
		context.xpTrackData = this._calculateTrackerValues(
			this.actor.system.experience,
			context.maxXP
		);

		// Populate status of values on the XP track to make rendering it more
		// efficient
		//
		context.maxVoid = this.actor.system.void.max;
		context.voidTrackData = this._calculateTrackerValues(
			this.actor.system.void.value,
			context.maxVoid
		);

		return context;
	}
}
