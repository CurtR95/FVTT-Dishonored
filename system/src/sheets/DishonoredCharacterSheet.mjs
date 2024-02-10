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

	/* -------------------------------------------- */

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// const dishonoredActor = new DishonoredSharedActorFunctions();

		// This creates a dynamic Void Point tracker. It polls for the hidden
		// control "max-void" and for the value, creates a new div for each and
		// places it under a child called "bar-void-renderer"
		// const voidPointsMax = html.find("#max-void")[0].value;
		// for (let i = 1; i <= voidPointsMax; i++) {
		// 	const div = document.createElement("DIV");
		// 	div.className = "box";
		// 	div.id = `void-${i}`;
		// 	div.innerHTML = i;
		// 	div.style = `width: calc(100% / ${html.find("#max-void")[0].value});`;
		// 	html.find("#bar-void-renderer")[0].appendChild(div);
		// }

		// Handle experience track clicks
		//
		html.find("[id^=\"exp\"]").click(
			event => this._updateFromClickedTrack(event)
		);

		// Handle void track clicks
		//
		html.find("[id^=\"void\"]").click(
			event => this._updateFromClickedTrack(event)
		);

		html.find("#decrease-void-max").click(() => this.actor.adjustVoidMax(-1));
		html.find("#increase-void-max").click(() => this.actor.adjustVoidMax(1));

		// Fires the function dishonoredRenderTracks as soon as the parameters exist to do so.
		// dishonoredActor.dishonoredRenderTracks(
		// 	html, this.actor.system.stress.max, voidPointsMax, 0
		// );

	}

	/** @override */
	async getData() {
		const context = await super.getData();

		context.bonecharmsEquipped = this.actor.bonecharmsEquippedCount;

		// Populate status of values on the XP track to make rendering it more
		// efficient
		//
		const maxXP = game.settings.get(SYSTEM_ID, "maxNumberOfExperience");

		context.xpBaseStyle = `width: calc(100% / ${maxXP});`;
		context.xpTrackData = this._calculateTrackerValues(
			this.actor.system.experience,
			maxXP
		);

		// Populate status of values on the XP track to make rendering it more
		// efficient
		//
		const maxVoid = this.actor.system.void.max;

		context.voidBaseStyle = `width: calc(100% / ${maxVoid});`;
		context.voidTrackData = this._calculateTrackerValues(
			this.actor.system.void.value,
			maxVoid
		);

		return context;
	}
}
