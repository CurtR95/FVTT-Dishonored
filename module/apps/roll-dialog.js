export class DishonoredRollDialog {

	static async create()
	{
		const html = await renderTemplate("systems/FVTT-Dishonored/templates/apps/dicepool.html");
		return new Promise((resolve) => {
			let formData = null;
			const dlg = new Dialog({
				title: game.i18n.localize('dishonored.apps.dicepoolwindow'),
				content: html,
				buttons: {
					roll: {
						label: game.i18n.localize('dishonored.apps.rolldice'),
						callback: html => {
							formData = new FormData(html[0].querySelector("#dice-pool-form"));
							return resolve(formData);
						}
					}
				},
				default: "roll",
				close: () => {}
			});
			dlg.render(true);
		});
	}
}
