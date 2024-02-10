export default class DishonoredItemSheet extends ItemSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["dishonored", "sheet", "item"],
			width: 565,
			height: 480,
			tabs: [{
				navSelector: ".sheet-tabs",
				contentSelector: ".sheet-body",
				initial: "description",
			}],
		});
	}

	/** @override */
	get template() {
		return `systems/FVTT-Dishonored/templates/items/${this.item.type}-sheet.hbs`;
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// -------------------------------------------------------------
		// ! Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		html.find(".send2actor").click(async event => {
			event.preventDefault();

			await this.createActorFromContact(
				this.item.name,
				this.item.system.description,
				this.item.img
			);

			return ui.notifications.info(
				game.i18n.format(
					"dishonored.notifications.sendToActor",
					{ name: this.item.name }
				)
			);
		});
	}

	/** @override */
	async getData(options={}) {
		const context = await super.getData(options);

		context.DISHONORED = CONFIG.DISHONORED;

		context.canSendToActor = game.user.hasRole(
			game.settings.get(
				SYSTEM_ID, "send2ActorPermissionLevel"
			)
		);

		context.cssClass += ` ${this.item.type}`;

		context.descriptionHTML = await TextEditor.enrichHTML(
			this.item.system.description,
			{
				async: true,
				secrets: this.item.isOwner,
			}
		);

		return context;
	}

	// Create an actor with the name, img and notes set from the contact - the
	// actor is hardcoded as NPC here.
	async createActorFromContact(name, description, img) {
		if (!this.item.type === "contact") return;

		await Actor.create({
			name,
			type: "npc",
			img,
			data: {
				notes: description,
			},
			token: {},
			items: [],
			flags: {},
		});
	}
}
