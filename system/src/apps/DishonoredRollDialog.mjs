export default class DishonoredRollDialog {

	static async create() {
		const html = await renderTemplate(
			"systems/FVTT-Dishonored/templates/apps/dicepool.hbs"
		);

		// Create a new promise for the HTML above.
		return new Promise(resolve => {
			let formData = null;

			const dialog = new Dialog({
				title: game.i18n.localize("dishonored.apps.dicepoolwindow"),
				content: html,
				buttons: {
					roll: {
						label: game.i18n.localize("dishonored.apps.rolldice"),
						callback: html => {
							formData = new FormData(
								html[0].querySelector("#dice-pool-form")
							);

							return resolve(formData);
						},
					},
				},
				default: "roll",
				close: () => {},
			});

			dialog.render(true);
		});
	}
}
