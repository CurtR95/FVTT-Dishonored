import { DishonoredSharedActorFunctions } from "../documents/DishonoredActor.mjs";

export default class DishonoredBaseActorSheet extends ActorSheet {

	dishonoredActor = new DishonoredSharedActorFunctions();

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

	/* -------------------------------------------- */

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
		const maxStress = this.actor.system.stress.max;

		context.stressBaseStyle = `width: calc(100% / ${maxStress});`;
		context.stressTrackData = this._calculateTrackerValues(
			this.actor.system.stress.value,
			maxStress
		);

		return context;
	}

	/* -------------------------------------------- */

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// Opens the class DishonoredSharedActorFunctions for access at various stages.
		let dishonoredActor = new DishonoredSharedActorFunctions();

		// If the player has limited access to the actor, there is nothing to see here. Return.
		if (!game.user.isGM && this.actor.limited) return;

		// We use i a lot in for loops. Best to assign it now for use later in multiple places.
		let i;

		// This allows for each item-edi1t image to link open an item sheet.
		// This uses Simple WorldBuilding System Code.
		html.find(".control.edit").click(ev => {
			const li = $(ev.currentTarget).parents(".entry");
			const item = this.actor.items.get(li.data("itemId"));
			item.sheet.render(true);
		});

		// This if statement checks if the form is editable, if not it hides
		// control used by the owner, then aborts any more of the script.
		if (!this.options.editable) {
			// This hides the ability to Perform a Skill Test for the character.
			for (i = 0; i < html.find(".check-button").length; i++) {
				html.find(".check-button")[i].style.display = "none";
			}
			// This hides the ability to change the amount of Void Points the character has.
			for (i = 0; i < html.find(".voidchange").length; i++) {
				html.find(".voidchange")[i].style.display = "none";
			}
			// This hides all toggle, add and delete item images.
			for (i = 0; i < html.find(".control.create").length; i++) {
				html.find(".control.create")[i].style.display = "none";
			}
			for (i = 0; i < html.find(".control.delete").length; i++) {
				html.find(".control.delete")[i].style.display = "none";
			}
			for (i = 0; i < html.find(".control.toggle").length; i++) {
				html.find(".control.delete")[i].style.display = "none";
			}
			// This hides all skill and style check boxes (and titles)
			for (i = 0; i < html.find(".selector").length; i++) {
				html.find(".selector")[i].style.display = "none";
			}
			for (i = 0; i < html.find(".selector").length; i++) {
				html.find(".selector")[i].style.display = "none";
			}
			// Remove hover CSS from clickables that are no longer clickable.
			for (i = 0; i < html.find(".box").length; i++) {
				html.find(".box")[i].classList.add("unset-clickables");
			}
			for (i = 0; i < html.find(".rollable").length; i++) {
				html.find(".rollable")[i].classList.add("unset-clickables");
			}
			return;
		}

		// This toggles whether the item is equipped or not. Equipped items count towards item caps.
		html.find(".control.toggle").click(async event => {
			event.preventDefault();
			const itemId = event.currentTarget.closest(".entry").dataset.itemId;
			this.actor.equipItem(itemId);
		});

		// This allows for all items to be rolled, it gets the current targets
		// type and id and sends it to the rollGenericItem function.
		html.find(".rollable").click(ev => {
			let itemType = $(ev.currentTarget).parents(".entry")[0].getAttribute("data-item-type");
			let itemId = $(ev.currentTarget).parents(".entry")[0].getAttribute("data-item-id");
			dishonoredActor.rollGenericItem(ev, itemType, itemId, this.actor);
		});

		// Allows item-create images to create an item of a type defined
		// individually by each button. This uses code found via the Foundry
		// VTT System Tutorial.
		html.find(".control.create").click(ev => {
			ev.preventDefault();
			const header = ev.currentTarget;
			const type = header.dataset.type;
			const data = duplicate(header.dataset);
			const name = `${game.i18n.format("dishonored.actor.item.adjectiveNew")} ${type.charAt(0).toUpperCase()}${type.slice(1)}`;

			const itemData = {
				name: name,
				type: type,
				data: data,
			};
			delete itemData.data.type;

			// stressTrackUpdate();

			return this.actor.createEmbeddedDocuments("Item", [(itemData)]);
		});

		// Allows item-delete images to allow deletion of the selected item.
		// This uses Simple WorldBuilding System Code.
		html.find(".control.delete").click(ev => {
			const li = $(ev.currentTarget).parents(".entry");
			this.actor.deleteEmbeddedDocuments("Item", [li.data("itemId")]);

			return li.slideUp(200, () => this.render(false));
		});

		// Stress track
		html.find("[id^=\"stress\"]").click(
			event => this._updateFromClickedTrack(event)
		);

		// Turns the Skill checkboxes into essentially a radio button. It
		// removes any other ticks, and then checks the new skill.
		// Finally a submit is required as data has changed.
		html.find(".selector.skill").click(ev => {
			for (i = 0; i <= 5; i++) {
				html.find(".selector.skill")[i].checked = false;
			}
			$(ev.currentTarget)[0].checked = true;
			this.submit();
		});

		// Turns the Style checkboxes into essentially a radio button. It
		// removes any other ticks, and then checks the new style.
		// Finally a submit is required as data has changed.
		html.find(".selector.style").click(ev => {
			for (i = 0; i <= 5; i++) {
				html.find(".selector.style")[i].checked = false;
			}
			$(ev.currentTarget)[0].checked = true;
			this.submit();
		});

		// If the check-button is clicked it grabs the selected skill and the
		// selected style and fires the method rollSkillTest. See actor.mjs for
		// further info.
		html.find(".check-button").click(ev => {
			let selectedSkill;
			let selectedSkillValue;
			let selectedStyle;
			let selectedStyleValue;
			for (i = 0; i <= 5; i++) {
				if (html.find(".selector.skill")[i].checked === true) {
					let selectedSkillHTML = html.find(".selector.skill")[i].id;
					selectedSkill = selectedSkillHTML.slice(0, -9);
					selectedSkillValue = html.find(`#${selectedSkill}`)[0].value;
				}
			}
			for (i = 0; i <= 5; i++) {
				if (html.find(".selector.style")[i].checked === true) {
					let selectedStyleHTML = html.find(".selector.style")[i].id;
					selectedStyle = selectedStyleHTML.slice(0, -9);
					selectedStyleValue = html.find(`#${selectedStyle}`)[0].value;
				}
			}
			let checkTarget = parseInt(selectedSkillValue, 10)
				+ parseInt(selectedStyleValue, 10);

			dishonoredActor.rollSkillTest(
				ev,
				checkTarget,
				selectedSkill,
				selectedStyle,
				this.actor
			);
		});
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
