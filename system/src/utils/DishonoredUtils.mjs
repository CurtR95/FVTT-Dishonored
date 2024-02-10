export default class DishonoredUtils {

	static clampValue(value, min=0, max=1) {
		return Math.max(min, Math.min(max, value));
	}

	// If this is a new release, show the release notes to the GM the first time
	// they login
	static async showNewReleaseNotes() {
		if (game.user.isGM) {
			const savedVersion = game.settings.get(SYSTEM_ID, "systemVersion");
			const systemVersion = game.system.version;

			if (systemVersion !== savedVersion) {
				Hotbar.toggleDocumentSheet(
					CONFIG.DISHONORED.JOURNAL_UUIDS.releaseNotes
				);

				game.settings.set(SYSTEM_ID, "systemVersion", systemVersion);
			}
		}
	}
}
