import { DishonoredBaseItemSheet } from "./DishonoredBaseItemSheet";

export class DishonoredContactSheet extends DishonoredBaseItemSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			height: 400,
		});
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// If the sheet is not editable, hide the Send2Actor button (as the
		// player shouldn't be able to edit this!). Also bump up the size of the
		// Description editor.
		if (!this.options.editable) {
			html.find(".send2actor")[0].style.display = "none";
			html.find(".description")[0].style.height = "calc(100% - 50px)";
			return;
		}

		// Check if the user has the role set in the system settings. If not
		// hide the button from the user.
		if (!game.user.hasRole(game.settings.get("FVTT-Dishonored", "send2ActorPermissionLevel"))) {
			html.find(".send2actor")[0].style.display = "none";
		}
		else {
			html.find(".send2actor").click(ev => {
				// Grab the value of the name field, the editor content and the
				// img src and send this to the send2Actor method.
				let name = html.find("#name")[0].value;
				let description = html.find(".editor-content")[0].innerHTML;
				let img = html.find(".img")[0].getAttribute("src");
				let localisedText = game.i18n.localize("dishonored.notifications.s2A");
				this.send2Actor(name, description, img).then(ui.notifications.info(localisedText.replace("|#|", name)));
			});
		}
	}

	// Create an actor with the name, img and notes set from the contact - the
	// actor is hardcoded as NPC here.
	async send2Actor(name, description, img) {
		await Actor.create({
			name: name,
			type: "npc",
			img: img,
			sort: 12000,
			data: {
				notes: description,
			},
			token: {},
			items: [],
			flags: {},
		});
	}

}
