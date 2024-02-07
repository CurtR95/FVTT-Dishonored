export class DishonoredItem extends Item {

	get isHelmet() {
		return this.type === "armor" && this.system.helmet;
	}

	async _preCreate(data, options, user) {
		await super._preCreate(data, options, user);

		if (data.img) return; // Already had an image set so we won't change it

		const img = "systems/FVTT-Dishonored/icons/dishonoredDefaultLogo.webp";
		this.updateSource({img});
	}

	prepareData() {
		super.prepareData();

		if (this.type === "focus") {
			// Checks if the rating of the focus is above 5 or 2. If it exceeds
			// these bounds it sets it to the closest limit. (i.e. 1 is set to 2)
			if (this.system.rating > 5) this.system.rating = 5;
			if (this.system.rating < 2) this.system.rating = 2;
		}
	}

}
