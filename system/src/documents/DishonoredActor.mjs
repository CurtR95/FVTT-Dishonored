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

	// This handles performing an "item" roll by clicking the item's image.
	async rollGenericItem(event, type, id) {
		event.preventDefault();
		let item = this.items.get(id);

		switch (type) {
			case "item":
				dishonored.roll.performItemRoll(item, this);
				break;
			case "focus":
				dishonored.roll.performFocusRoll(item, this);
				break;
			case "bonecharm":
				dishonored.roll.performBonecharmRoll(item, this);
				break;
			case "weapon":
				dishonored.roll.performWeaponRoll(item, this);
				break;
			case "armor":
				dishonored.roll.performArmorRoll(item, this);
				break;
			case "talent":
				dishonored.roll.performTalentRoll(item, this);
				break;
			case "truth":
				dishonored.roll.performTruthRoll(item, this);
				break;
			case "contact":
				dishonored.roll.performContactRoll(item, this);
				break;
			case "power":
				dishonored.roll.performPowerRoll(item, this);
				break;
		}
	}

	// This handles performing a skill test using the "Perform Check" button.
	async rollSkillTest(event, checkTarget, selectedSkill, selectedStyle, speaker) {
		event.preventDefault();
		// This creates a dialog to gather details regarding the roll and waits for a response
		let rolldialog = await dishonored.rollDialog.create();
		if (rolldialog) {
			let dicePool = rolldialog.get("dicePoolSlider");
			let focusTarget = parseInt(rolldialog.get("dicePoolFocus"));

			// Once the response has been collected it then sends it to be rolled.
			dishonored.roll.performSkillTest(
				dicePool,
				checkTarget,
				focusTarget,
				selectedSkill,
				selectedStyle,
				speaker
			);
		}
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
