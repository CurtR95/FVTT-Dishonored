export default async function preloadTemplates() {
	const partials = [
		"systems/FVTT-Dishonored/templates/actors/partials/actor-image.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/decorations/body-svg.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/decorations/column-svg.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/decorations/header-svg.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/headers/character.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/headers/npc.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/inventory-item.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/inventory-section.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/navigation.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/skills.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/styles.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/tabs/abilities.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/tabs/belongings.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/tabs/biography.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/tabs/focuses.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/tabs/notes.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/tabs/partials/currency.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/tabs/partials/mana.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/tracks/stress.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/tracks/void.hbs",
		"systems/FVTT-Dishonored/templates/actors/partials/tracks/xp.hbs",
		"systems/FVTT-Dishonored/templates/items/partials/description.hbs",
	];

	const paths = {};
	for (const path of partials) {
		const [key] = path.split("/").slice(3).join("/").split(".");
		paths[key] = path;
	}

	return loadTemplates(paths);
}
