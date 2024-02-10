export default class DishonoredBaseActorSheet extends ActorSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			width: 700,
			height: 800,
			tabs: [{
				navSelector: ".sheet-tabs",
				contentSelector: ".sheet-body",
				initial: "focuses",
			}],
			scrollY: [
				".focuses",
				".abilities",
				".belongings",
				".biography",
				".notes",
			],
			dragDrop: [{
				dragSelector: ".item-list .item",
				dropSelector: null,
			}],
		});
	}

	/* -------------------------------------------- */

	/** @override */
	get template() {
		const template = !game.user.isGM && this.actor.limited
			? "systems/FVTT-Dishonored/templates/actors/limited-sheet.hbs"
			: "systems/FVTT-Dishonored/templates/actors/actor-sheet.hbs";

		return template;
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// -------------------------------------------------------------
		// ! Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		html.find(".control.create").click(event => {
			event.preventDefault();
			const header = event.currentTarget;
			const type = header.dataset.type;
			const data = duplicate(header.dataset);
			const name = `${game.i18n.format("dishonored.actor.item.adjectiveNew")} ${type.charAt(0).toUpperCase()}${type.slice(1)}`;

			const itemData = {
				name: name,
				type: type,
				data: data,
			};
			delete itemData.data.type;

			return this.actor.createEmbeddedDocuments("Item", [(itemData)]);
		});

		html.find(".control.delete").click(event => {
			event.preventDefault();
			const li = $(event.currentTarget).parents(".entry");
			this.actor.deleteEmbeddedDocuments("Item", [li.data("itemId")]);

			return li.slideUp(200, () => this.render(false));
		});

		html.find(".control.edit").click(event => {
			event.preventDefault();
			const li = $(event.currentTarget).parents(".entry");
			const item = this.actor.items.get(li.data("itemId"));
			item.sheet.render(true);
		});

		// This toggles whether the item is equipped or not. Equipped items count towards item caps.
		html.find(".control.toggle").click(async event => {
			event.preventDefault();
			const itemId = event.currentTarget.closest(".entry").dataset.itemId;
			this.actor.equipItem(itemId);
		});

		// This allows for all items to be rolled, it gets the current targets
		// type and id and sends it to the rollGenericItem function.
		html.find(".rollable").click(event => {
			event.preventDefault();
			let itemType = $(event.currentTarget).parents(".entry")[0].getAttribute("data-item-type");
			let itemId = $(event.currentTarget).parents(".entry")[0].getAttribute("data-item-id");
			this.actor.rollGenericItem(event, itemType, itemId);
		});

		// Stress track
		html.find("[id^=\"stress\"]").click(
			event => this._updateFromClickedTrack(event)
		);

		// Turns the Skill checkboxes into essentially a radio button. It
		// removes any other ticks, and then checks the new skill.
		// Finally a submit is required as data has changed.
		html.find(".selector.skill").click(event => {
			for (let i = 0; i <= 5; i++) {
				html.find(".selector.skill")[i].checked = false;
			}
			$(event.currentTarget)[0].checked = true;
			this.submit();
		});

		// Turns the Style checkboxes into essentially a radio button. It
		// removes any other ticks, and then checks the new style.
		// Finally a submit is required as data has changed.
		html.find(".selector.style").click(event => {
			for (let i = 0; i <= 5; i++) {
				html.find(".selector.style")[i].checked = false;
			}
			$(event.currentTarget)[0].checked = true;
			this.submit();
		});

		// If the check-button is clicked it grabs the selected skill and the
		// selected style and fires the method rollSkillTest. See actor.mjs for
		// further info.
		html.find(".check-button").click(event => {
			let selectedSkill;
			let selectedSkillValue;
			let selectedStyle;
			let selectedStyleValue;
			for (let i = 0; i <= 5; i++) {
				if (html.find(".selector.skill")[i].checked === true) {
					let selectedSkillHTML = html.find(".selector.skill")[i].id;
					selectedSkill = selectedSkillHTML.slice(0, -9);
					selectedSkillValue = html.find(`#${selectedSkill}`)[0].value;
				}
			}
			for (let i = 0; i <= 5; i++) {
				if (html.find(".selector.style")[i].checked === true) {
					let selectedStyleHTML = html.find(".selector.style")[i].id;
					selectedStyle = selectedStyleHTML.slice(0, -9);
					selectedStyleValue = html.find(`#${selectedStyle}`)[0].value;
				}
			}
			let checkTarget = parseInt(selectedSkillValue, 10)
				+ parseInt(selectedStyleValue, 10);

			this.actor.rollSkillTest(
				event,
				checkTarget,
				selectedSkill,
				selectedStyle,
				this.actor
			);
		});
	}

	/** @override */
	async getData() {
		const context = await super.getData();

		context.DISHONORED = CONFIG.DISHONORED;

		context.inventory = await this._prepareInventory();
		context.isCharacter = this.actor.type === "character";
		context.isNPC = this.actor.type === "npc";
		context.system = duplicate(context.data.system);

		context.notesHTML = await TextEditor.enrichHTML(
			this.actor.system.notes,
			{
				async: true,
			}
		);

		// Populate status of values on the Stress track
		//
		context.maxStress = this.actor.system.stress.max;
		context.stressTrackData = this._calculateTrackerValues(
			this.actor.system.stress.value,
			context.maxStress
		);

		return context;
	}


	_calculateTrackerValues(current, max) {
		const values = [];

		for (let i = 0; i < max; i++) {
			values.push({
				value: i + 1,
				selected: i < current,
			});
		}

		return values;
	}

	_updateFromClickedTrack(event) {
		event.preventDefault();

		const barElement = event.currentTarget.parentElement;
		const currentValue = parseInt(barElement.dataset.currentValue);
		const systemKey = barElement.dataset.systemKey;

		let selectedValue = parseInt(event.currentTarget.dataset.clickedValue);

		// If we're clicking the current value, assume that the intention
		// is to toggle it off
		//
		if (selectedValue === currentValue) {
			selectedValue--;
		}

		const updateData = {};
		updateData[systemKey] = selectedValue;

		this.actor.update(updateData);
	}

	async _prepareInventory() {
		const itemCategories = {};

		for (const item of this.actor.items) {
			const itemCopy = duplicate(item);

			if (!Object.hasOwn(itemCategories, itemCopy.type)) {
				itemCategories[itemCopy.type] = [];
			}

			itemCategories[itemCopy.type].push(itemCopy);
		}

		for (const section in itemCategories) {
			itemCategories[section] = itemCategories[section].sort(
				(a, b) => a.name.localeCompare(b.name)
			);
		}

		return itemCategories;
	}
}
