import { DISHONORED, SYSTEM_ID, SYSTEM_NAME } from "../config.mjs";

import * as documents from "../documents/_module.mjs";
import * as sheets from "../sheets/_module.mjs";

import { DishonoredHooks } from "../system/DishonoredHooks.mjs";

import DishonoredRollDialog from "../apps/DishonoredRollDialog.mjs";
import DishonoredTracker from "../apps/DishonoredTracker.mjs";
import DishonoredUtils from "../utils/DishonoredUtils.mjs";
import Logger from "../utils/Logger.mjs";

import installTokenBarShim from "../tokens.mjs";
import registerSettings from "../settings.mjs";

export async function initHook() {
	console.debug(`${SYSTEM_NAME} | Running init hook`);

	CONFIG.DISHONORED = DISHONORED;

	globalThis.SYSTEM_ID = SYSTEM_ID;
	globalThis.SYSTEM_NAME = SYSTEM_NAME;

	globalThis.dishonored = {
		logger: Logger,
		rollDialog: DishonoredRollDialog,
		tracker: new DishonoredTracker(),
		utils: DishonoredUtils,
	};

	CONFIG.Combat.initiative = {
		formula: "@styles.swiftly.value",
		decimals: 0,
	};

	registerDocumentClasses();
	registerDocumentSheets();

	registerSettings();

	installTokenBarShim();

	DishonoredHooks.attach();
}

function registerDocumentClasses() {
	CONFIG.Actor.documentClass = documents.DishonoredActor;
	CONFIG.Item.documentClass = documents.DishonoredItem;
}

function registerDocumentSheets() {
	Actors.unregisterSheet("core", ActorSheet);

	Actors.registerSheet("dishonored", sheets.DishonoredCharacterSheet, {
		types: ["character"],
		makeDefault: true,
	});

	Actors.registerSheet("dishonored", sheets.DishonoredNPCSheet, {
		types: ["npc"],
	});

	Items.unregisterSheet("core", ItemSheet);

	Items.registerSheet("dishonored", sheets.DishonoredItemSheet, {
		makeDefault: true,
	});
}
