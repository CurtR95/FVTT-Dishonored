export class DishonoredLogo extends Application {

	static get defaultOptions() {
		const options = super.defaultOptions;
		options.template = "systems/FVTT-Dishonored/templates/apps/logo.hbs";
		options.popOut = false;
		options.resizable = false;
		return options;
	}

	activateListeners(html) {
		html[0].href += game.system.version;
		html.find("#dishonored-logo-verID")[0].innerHTML = game.system.version;
	}
}

