export class DishonoredBaseItemSheet extends ItemSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["dishonored", "sheet", "item"],
			width: 500,
			height: 250,
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
	async getData(options={}) {
		const context = await super.getData(options);

		context.descriptionHTML = await TextEditor.enrichHTML(
			this.item.system.description,
			{
				async: true,
			}
		);

		return context;
	}
}
