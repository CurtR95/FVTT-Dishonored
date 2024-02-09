export default async function preloadTemplates() {
	const partials = [
		"systems/FVTT-Dishonored/templates/items/partials/description.hbs",
	];

	const paths = {};
	for (const path of partials) {
		const [key] = path.split("/").slice(3).join("/").split(".");
		paths[key] = path;
	}

	return loadTemplates(paths);
}
