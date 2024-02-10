export default class DishonoredTracker extends Application {

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			template: "systems/FVTT-Dishonored/templates/apps/tracker.hbs",
			popOut: false,
			resizable: false,
		});
	}

	get canEditChaos() {
		const chaosEditRole = game.settings.get(SYSTEM_ID, "chaosPermissionLevel");
		return game.user.isGM || game.user.hasRole(chaosEditRole);
	}

	get canEditMomentum() {
		const momentumEditRole = game.settings.get(SYSTEM_ID, "momentumPermissionLevel");
		return game.user.isGM || game.user.hasRole(momentumEditRole);
	}

	activateListeners(html) {
		html.find("#dishonored-chaos-track-increase").click(event => {
			event.preventDefault();
			DishonoredTracker.changeCounter(1, "chaos");
		});

		html.find("#dishonored-chaos-track-decrease").click(event => {
			event.preventDefault();
			DishonoredTracker.changeCounter(-1, "chaos");
		});

		// We want it so that we unfocus if the enter key is pressed, we do this
		// by recording the keycode 13 and bluring.
		html.find("#dishonored-track-chaos").keydown(event => {
			if (event.keyCode === 13) {
				event.preventDefault();
				html.find("#dishonored-track-chaos").blur();
			}
		});

		// This is what is fired when the chaos tracker text box is edited.
		html.find("#dishonored-track-chaos").change(event => {
			event.preventDefault();

			const value = document.getElementById("dishonored-track-chaos").value ?? "";

			// Ignore empty values and just re-render
			if (value === "") return dishonored.tracker.render(true);

			// Handle +/- adjustments
			const plusMinusMatch = /([+-]{1})\s*(\d+)/;
			const plusMinusMatched = value.match(plusMinusMatch);
			if (plusMinusMatched) {
				const sign = plusMinusMatched[1];
				const intValue = Number.parseInt(plusMinusMatched[2]);

				const diff = sign === "-" ? -intValue : intValue;

				return DishonoredTracker.changeCounter(diff, "chaos");
			}

			// Now make sure it's a number and assign if so
			const intValue = Number.parseInt(value);

			if (isNaN(intValue)) {
				// Ignore bad values and re-render
				return dishonored.tracker.render(true);
			}
			else {
				return DishonoredTracker.setCounter(intValue, "chaos");
			}
		});

		html.find("[id^=\"dishonored-momentum-tracker\"]").click(ev => {
			if (!this.canEditMomentum) return;

			let captureObject = $(ev.currentTarget)[0];
			let newTotal = captureObject.id.replace(/\D/g, "");

			let newMomentum = Number.parseInt(newTotal);
			const currentMomentum = game.settings.get(SYSTEM_ID, "momentum");

			if (newMomentum === currentMomentum) {
				newMomentum--;
			}

			return DishonoredTracker.setCounter(newMomentum, "momentum");
		});
	}

	/**
	 * Change the counter of (type) by (value)
	 * @param diff How much to change the counter
	 * @param type  Type of counter, "momentum" or "chaos"
	 */
	static async changeCounter(diff, type) {
		this.checkCounterUpdate(diff, type);

		let value = game.settings.get(SYSTEM_ID, type);
		if (value + diff > 6 && type === "momentum") {
			await DishonoredTracker.setCounter(6, type);
		}
		else if (value + diff > 99 && type === "chaos") {
			await DishonoredTracker.setCounter(99, type);
		}
		else if (value + diff < 0) {
			await DishonoredTracker.setCounter(0, type);
		}
		else {
			value += diff;
			await DishonoredTracker.setCounter(value, type);
		}
	}

	// Check user entry. Rerender if error is detected to reset to the correct value
	static checkCounterUpdate(value, type) {
		const updateError = {
			counter: "Dishonored | Error updating Counter: Invalid Counter Type",
			value: "Dishonored | Error updating Counter: Invalid Value Type",
		};

		if (type !== "chaos" && type !== "momentum") {
			ui.notifications.error("Error updating Counter: Invalid Counter Type");
			dishonored.tracker.render(true);
			throw updateError.counter;
		}

		if (Number.isNaN(value)) {
			ui.notifications.error("Error updating Counter: Invalid Value Type");
			dishonored.tracker.render(true);
			throw updateError.value;
		}
	}

	async getData() {
		const data = super.getData();

		data.canEditChaos = this.canEditChaos;
		data.canEditMomentum = this.canEditMomentum;

		data.chaos = game.settings.get(SYSTEM_ID, "chaos");
		data.momentum = game.settings.get(SYSTEM_ID, "momentum");

		// Create LUT which specifies wether a momentum segment should be shown
		// as enabled or not
		//
		data.momentumEnabled = {};

		for (let i = 0; i < 6; i++) {
			data.momentumEnabled[i + 1] = i < data.momentum;
		}

		return data;
	}

	/**
	 * Set the counter of (type) to (value)
	 * @param value Value to set counter to
	 * @param type  Type of counter, "momentum" or "chaos"
	 */
	static async setCounter(value, type) {
		DishonoredTracker.checkCounterUpdate(value, type);

		value = Math.round(value);

		if (!game.user.isGM) {
			game.socket.emit(`system.${SYSTEM_ID}`, {
				type: "setCounter",
				payload: {value, type},
			});
			return;
		}

		if (value > 6 && type === "momentum") {
			await game.settings.set(SYSTEM_ID, type, 6);
		}
		if (value > 99 && type === "chaos") {
			await game.settings.set(SYSTEM_ID, type, 99);
		}
		else if (value < 0) {
			await game.settings.set(SYSTEM_ID, type, 0);
		}
		else {
			await game.settings.set(SYSTEM_ID, type, value);
		}

		dishonored.tracker.render(true);

		// Emit socket event for users to rerender their counters
		game.socket.emit(`system.${SYSTEM_ID}`, {type: "updateCounter"});
	}
}
