export default function registerSettings() {

	// -------------------
	//  INTERNAL SETTINGS
	// -------------------
	//
	game.settings.register(SYSTEM_ID, "chaos", {
		scope: "world",
		type: Number,
		default: 0,
		config: false,
	});

	game.settings.register(SYSTEM_ID, "momentum", {
		scope: "world",
		type: Number,
		default: 0,
		config: false,
	});

	// -----------------
	//  PUBLIC SETTINGS
	// -----------------
	//
	game.settings.register(SYSTEM_ID, "multipleComplications", {
		name: game.i18n.localize("dishonored.settings.names.multipleComplications"),
		hint: game.i18n.localize("dishonored.settings.hints.multipleComplications"),
		scope: "world",
		type: Boolean,
		default: true,
		config: true,
	});

	game.settings.register(SYSTEM_ID, "send2ActorPermissionLevel", {
		name: game.i18n.localize("dishonored.settings.names.send2ActorPermissionLevel"),
		hint: game.i18n.localize("dishonored.settings.hints.send2ActorPermissionLevel"),
		scope: "world",
		type: String,
		default: "ASSISTANT",
		config: true,
		choices: {
			NONE: "Switch Off Send2Actor",
			PLAYER: game.i18n.localize("USER.RolePlayer"),
			TRUSTED: game.i18n.localize("USER.RoleTrusted"),
			ASSISTANT: game.i18n.localize("USER.RoleAssistant"),
			GAMEMASTER: game.i18n.localize("USER.RoleGamemaster"),
		},
	});

	game.settings.register(SYSTEM_ID, "chaosPermissionLevel", {
		name: game.i18n.localize("dishonored.settings.names.chaosPermissionLevel"),
		hint: game.i18n.localize("dishonored.settings.hints.chaosPermissionLevel"),
		scope: "world",
		type: String,
		default: "ASSISTANT",
		config: true,
		choices: {
			PLAYER: game.i18n.localize("USER.RolePlayer"),
			TRUSTED: game.i18n.localize("USER.RoleTrusted"),
			ASSISTANT: game.i18n.localize("USER.RoleAssistant"),
			GAMEMASTER: game.i18n.localize("USER.RoleGamemaster"),
		},
	});

	game.settings.register(SYSTEM_ID, "momentumPermissionLevel", {
		name: game.i18n.localize("dishonored.settings.names.momentumPermissionLevel"),
		hint: game.i18n.localize("dishonored.settings.hints.momentumPermissionLevel"),
		scope: "world",
		type: String,
		default: "PLAYER",
		config: true,
		choices: {
			PLAYER: game.i18n.localize("USER.RolePlayer"),
			TRUSTED: game.i18n.localize("USER.RoleTrusted"),
			ASSISTANT: game.i18n.localize("USER.RoleAssistant"),
			GAMEMASTER: game.i18n.localize("USER.RoleGamemaster"),
		},
	});

	game.settings.register(SYSTEM_ID, "maxNumberOfExperience", {
		name: game.i18n.localize("dishonored.settings.names.maxNumberOfExperience"),
		hint: game.i18n.localize("dishonored.settings.hints.maxNumberOfExperience"),
		scope: "world",
		type: Number,
		default: 30,
		config: true,
	});

	// ----------------
	//  DEBUG SETTINGS
	// ----------------
	//
	game.settings.register(SYSTEM_ID, "debugEnabled", {
		name: "Enable/Disable Debug",
		hint: "Enable or Disable additional debug features",
		scope: "world",
		type: Boolean,
		config: true,
		default: false,
		requiresReload: true,
	});

	game.settings.register(SYSTEM_ID, "worldSchemaVersion", {
		name: "Schema Version",
		hint: "Records the current schema version for the Dishonored system data. (don't modify this unless you know what you are doing)",
		scope: "world",
		config: game.settings.get(SYSTEM_ID, "debugEnabled"),
		default: -1,
		type: Number,
	});

	game.settings.register(SYSTEM_ID, "systemVersion", {
		name: "System Version",
		hint: "Records the current Dishonored system version number (don't modify this unless you know what you are doing)",
		scope: "world",
		config: game.settings.get(SYSTEM_ID, "debugEnabled"),
		default: "",
		type: String,
	});
}
