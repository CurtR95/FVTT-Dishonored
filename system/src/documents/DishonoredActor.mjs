import {
	DishonoredRollDialog,
} from "../apps/roll-dialog.mjs";
import {
	DishonoredRoll,
} from "../roll.mjs";

export default class DishonoredActor extends Actor {

	async _preCreate(data, options, user) {
		await super._preCreate(data, options, user);

		if (data.img) return; // Already had an image set so we won"t change it

		const img = "/systems/FVTT-Dishonored/icons/dishonoredDefaultLogo.webp";
		this.updateSource({
			img,
			prototypeToken: {
				texture: {
					src: img,
				},
			},
		});
	}

	prepareData() {
		this._validateSkillValues();
		this._validateStyleValues();
		this._validateStressValues();

		if (this.type === "character") {
			this._validateCharacterData();
		}

		return this;
	}

	_validateCharacterData() {
		// Checks if mana max is not equal to double the void max, if it
		// isn't, set it so.
		if (this.system.mana.max !== 2 * this.system.void.max) {
			this.system.mana.max = 2 * this.system.void.max;
		}
		if (this.system.mana.max < 2) this.system.mana.max = 2;

		// For some reason - this is treated as a string, so this enforce
		// use of integers here.
		if (parseInt(this.system.mana.value, 10) > parseInt(this.system.mana.max, 10)) {
			this.system.mana.value = this.system.mana.max;
		}

		if (this.system.void.max < 1) this.system.void.max = 1;

		if (this.system.void.value > this.system.void.max) {
			this.system.void.value = this.system.void.max;
		}
		if (this.system.void.value < 0) {
			this.system.void.value = 0;
		}

		if (this.system.experience < 0) this.system.experience = 0;
		if (this.system.mana.value < 0) this.system.mana.value = 0;
	}

	_validateStressValues() {
		if (this.system.stress.value > this.system.stress.max) {
			this.system.stress.value = this.system.stress.max;
		}
		if (this.system.stress.value < 0) {
			this.system.stress.value = 0;
		}
	}

	_validateStyleValues() {
		const styles = [
			"boldly",
			"carefully",
			"cleverly",
			"forcefully",
			"quietly",
			"swiftly",
		];

		for (const style of styles) {
			if (this.system.styles[style].value > 8) {
				this.system.styles[style].value = 8;
			}
			if (this.system.styles[style].value < 4) {
				this.system.styles[style].value = 4;
			}
		}
	}

	_validateSkillValues() {
		const skills = [
			"fight",
			"move",
			"study",
			"survive",
			"talk",
			"tinker",
		];

		for (const skill of skills) {
			if (this.system.skills[skill].value > 8) {
				this.system.skills[skill].value = 8;
			}
			if (this.system.skills[skill].value < 4) {
				this.system.skills[skill].value = 4;
			}
		}
	}
}

export class DishonoredSharedActorFunctions {

	// This function renders all the tracks. This will be used every time the
	// character sheet is loaded. It is a vital element as such it runs before
	// most other code!
	dishonoredRenderTracks(html, stressTrackMax, voidPointsMax, expPointsMax, momentumMax) {
		let i;
		// Checks if details for the Stress Track was included, this should happen in all cases!
		if (stressTrackMax) {
			for (i = 0; i < stressTrackMax; i++) {
				if (i + 1 <= html.find("#total-stress")[0].value) {
					html.find("[id^=\"stress\"]")[i].setAttribute("data-selected", "true");
					html.find("[id^=\"stress\"]")[i].style.backgroundColor = "#191813";
					html.find("[id^=\"stress\"]")[i].style.color = "#ffffff";
				}
				else {
					html.find("[id^=\"stress\"]")[i].removeAttribute("data-selected");
					html.find("[id^=\"stress\"]")[i].style.backgroundColor = "rgb(255, 255, 255, 0.3)";
					html.find("[id^=\"stress\"]")[i].style.color = "";
				}
			}
		}
		// Checks if details for the Void Track was included, this should happen for all Characters!
		if (voidPointsMax) {
			for (i = 0; i < voidPointsMax; i++) {
				if (i + 1 <= html.find("#total-void")[0].value) {
					html.find("[id^=\"void\"]")[i].setAttribute("data-selected", "true");
					html.find("[id^=\"void\"]")[i].style.backgroundColor = "#191813";
					html.find("[id^=\"void\"]")[i].style.color = "#ffffff";
				}
				else {
					html.find("[id^=\"void\"]")[i].removeAttribute("data-selected");
					html.find("[id^=\"void\"]")[i].style.backgroundColor = "rgb(255, 255, 255, 0.3)";
					html.find("[id^=\"void\"]")[i].style.color = "";
				}
			}
		}
		// Checks if details for the Experience Track was included, this should
		// happen for all Characters!
		if (expPointsMax) {
			for (i = 0; i < expPointsMax; i++) {
				if (i + 1 <= html.find("#total-exp")[0].value) {
					html.find("[id^=\"exp\"]")[i].setAttribute("data-selected", "true");
					html.find("[id^=\"exp\"]")[i].style.backgroundColor = "#191813";
					html.find("[id^=\"exp\"]")[i].style.color = "#ffffff";
				}
				else {
					html.find("[id^=\"exp\"]")[i].removeAttribute("data-selected");
					html.find("[id^=\"exp\"]")[i].style.backgroundColor = "rgb(255, 255, 255, 0.8)";
					html.find("[id^=\"exp\"]")[i].style.color = "";
				}
			}
		}
		// Checks if details for the Momentum Track was included, this should
		// happen for all Characters!
		if (momentumMax) {
			for (i = 0; i < 6; i++) {
				if (i + 1 <= html.find("#total-mom")[0].value) {
					html.find("[id^=\"mom\"]")[i].setAttribute("data-selected", "true");
					html.find("[id^=\"mom\"]")[i].style.backgroundColor = "#191813";
					html.find("[id^=\"mom\"]")[i].style.color = "#ffffff";
				}
				else {
					html.find("[id^=\"mom\"]")[i].removeAttribute("data-selected");
					html.find("[id^=\"mom\"]")[i].style.backgroundColor = "rgb(255, 255, 255, 0.3)";
					html.find("[id^=\"mom\"]")[i].style.color = "";
				}
			}
		}
	}

	// This handles performing a skill test using the "Perform Check" button.
	async rollSkillTest(event, checkTarget, selectedSkill, selectedStyle, speaker) {
		event.preventDefault();
		// This creates a dialog to gather details regarding the roll and waits for a response
		let rolldialog = await DishonoredRollDialog.create();
		if (rolldialog) {
			let dicePool = rolldialog.get("dicePoolSlider");
			let focusTarget = parseInt(rolldialog.get("dicePoolFocus"));
			// Once the response has been collected it then sends it to be rolled.
			let dishonoredRoll = new DishonoredRoll();
			dishonoredRoll.performSkillTest(
				dicePool,
				checkTarget,
				focusTarget,
				selectedSkill,
				selectedStyle,
				speaker
			);
		}
	}

	// This handles performing an "item" roll by clicking the item's image.
	async rollGenericItem(event, type, id, speaker) {
		event.preventDefault();
		let item = speaker.items.get(id);
		let dishonoredRoll = new DishonoredRoll();
		// It will send it to a different method depending what item type was sent to it.
		switch (type) {
			case "item":
				dishonoredRoll.performItemRoll(item, speaker);
				break;
			case "focus":
				dishonoredRoll.performFocusRoll(item, speaker);
				break;
			case "bonecharm":
				dishonoredRoll.performBonecharmRoll(item, speaker);
				break;
			case "weapon":
				dishonoredRoll.performWeaponRoll(item, speaker);
				break;
			case "armor":
				dishonoredRoll.performArmorRoll(item, speaker);
				break;
			case "talent":
				dishonoredRoll.performTalentRoll(item, speaker);
				break;
			case "truth":
				dishonoredRoll.performTruthRoll(item, speaker);
				break;
			case "contact":
				dishonoredRoll.performContactRoll(item, speaker);
				break;
			case "power":
				dishonoredRoll.performPowerRoll(item, speaker);
				break;
		}
	}
}
