import {
	DishonoredRoll,
} from "../system/DishonoredRoll.mjs";

export default class DishonoredActor extends Actor {

	get armorEquippedCount() {
		return this.equippedArmor
			.filter(i => !i.system.helmet)
			.length;
	}

	get bonecharmsEquippedCount() {
		return this.itemsByType("bonecharm")
			.filter(i => i.system.equipped)
			.length;
	}

	get equippedArmor() {
		return this.itemsByType("armor")
			.filter(i => i.system.equipped);
	}

	get helmetsEquippedCount() {
		return this.equippedArmor
			.filter(i => i.system.helmet)
			.length;
	}

	async _preCreate(data, options, user) {
		await super._preCreate(data, options, user);

		if (data.img) return; // Already had an image set so we won't change it

		this.updateSource({
			img: CONFIG.DISHONORED.DEFAULT_IMAGES.SYMBOL_WHITE,
			prototypeToken: {
				texture: {
					src: CONFIG.DISHONORED.DEFAULT_TOKEN,
				},
			},
		});
	}

	async adjustVoidMax(amount) {
		const newVoidMax = this.system.void.max + amount;

		this.update({"system.void.max": Math.max(1, newVoidMax)});
	}

	async equipItem(itemId) {
		const item = this.items.get(itemId);

		const isHelmet = item.isHelmet;

		if (!item.system.equipped) {
			if (item.type === "bonecharm" && this.bonecharmsEquippedCount >= 3) {
				return ui.notifications.error(
					game.i18n.localize("dishonored.notifications.tooManyBonecharms")
				);
			}
			else if (item.type === "armor" && !isHelmet && this.armorEquippedCount >= 1) {
				return ui.notifications.error(
					game.i18n.localize("dishonored.notifications.armorAlreadyEquipped")
				);
			}
			else if (item.type === "armor" && isHelmet && this.helmetsEquippedCount >= 1) {
				return ui.notifications.error(
					game.i18n.localize("dishonored.notifications.helmetAlreadyEquipped")
				);
			}
		}

		return item.update({ "system.equipped": !item.system.equipped});
	}

	itemsByType(type) {
		return this.items.filter(i => i.type === type);
	}

	prepareData() {
		this._prepareSkillValues();
		this._prepareStyleValues();
		this._prepareStressValues();

		if (this.type === "character") {
			this._prepareCharacterData();
		}

		return this;
	}

	_prepareCharacterData() {
		// Checks if mana max is not equal to double the void max, if it
		// isn't, set it so.
		if (this.system.void.max < 1) this.system.void.max = 1;

		if (this.system.mana.max !== 2 * this.system.void.max) {
			this.system.mana.max = 2 * this.system.void.max;
		}
		if (this.system.mana.max < 2) this.system.mana.max = 2;

		// For some reason - this is treated as a string, so this enforce
		// use of integers here.
		if (parseInt(this.system.mana.value, 10) > parseInt(this.system.mana.max, 10)) {
			this.system.mana.value = this.system.mana.max;
		}

		this.system.void.value = dishonored.utils.clampValue(
			this.system.void.value,
			0,
			this.system.void.max
		);

		if (this.system.experience < 0) this.system.experience = 0;
		if (this.system.mana.value < 0) this.system.mana.value = 0;
	}

	_prepareStressValues() {
		let bonusStressFromArmor = 0;
		for (const item of this.equippedArmor) {
			bonusStressFromArmor += item.system.protection;
		}

		this.system.stress.max =
			this.system.skills.survive.value + bonusStressFromArmor;

		this.system.stress.value = dishonored.utils.clampValue(
			this.system.stress.value,
			0,
			this.system.stress.max
		);
	}

	_prepareStyleValues() {
		const styles = [
			"boldly",
			"carefully",
			"cleverly",
			"forcefully",
			"quietly",
			"swiftly",
		];

		for (const style of styles) {
			this.system.styles[style].value = dishonored.utils.clampValue(
				this.system.styles[style].value, 4, 8
			);
		}
	}

	_prepareSkillValues() {
		const skills = [
			"fight",
			"move",
			"study",
			"survive",
			"talk",
			"tinker",
		];

		for (const skill of skills) {
			this.system.skills[skill].value = dishonored.utils.clampValue(
				this.system.skills[skill].value, 4, 8
			);
		}
	}
}

export class DishonoredSharedActorFunctions {

	// This handles performing a skill test using the "Perform Check" button.
	async rollSkillTest(event, checkTarget, selectedSkill, selectedStyle, speaker) {
		event.preventDefault();
		// This creates a dialog to gather details regarding the roll and waits for a response
		let rolldialog = await dishonored.rollDialog.create();
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
