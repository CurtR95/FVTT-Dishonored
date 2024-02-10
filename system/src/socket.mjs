import DishonoredTracker from "./apps/DishonoredTracker.mjs";

export default function registerSocketEvents() {
	game.socket.on(`system.${SYSTEM_ID}`, event => {
		if (event.type === "setCounter" && game.user.isGM) {
			DishonoredTracker.setCounter(event.payload.value, event.payload.type);
		}

		if (event.type === "updateCounter") {
			dishonored.tracker.render(true);
		}
	});
}
