import DishonoredMigrationRunner from "../migrations/DishonoredMigrationRunner";
import registerSocketEvents from "../socket.mjs";

export const readyHook = {
	attach: () => {
		dishonored.logger.debug("Attaching ready hook");

		Hooks.once("ready", async () => {
			dishonored.logger.debug("Running ready hook");

			if (game.user.isGM) {
				await new DishonoredMigrationRunner().run();
			}

			registerSocketEvents();

			dishonored.tracker.render(true);

			dishonored.utils.showNewReleaseNotes();
		});
	},
};
