/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 * Software License: GNU GPLv3
 */

// Import Modules
import { DishonoredActor } from "./actors/actor.js";
import { DishonoredItemSheet } from "./items/item-sheet.js";
import { DishonoredCharacterSheet } from "./actors/sheets/character-sheet.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async function() {
  console.log(`Initializing Simple Worldbuilding System`);

	/**
	 * Set an initiative formula for the system
	 * @type {String}
	 */
	CONFIG.Combat.initiative = {
	  formula: "@styles.swiftly.value",
    decimals: 0
  };

	// Define custom Entity classes
  CONFIG.Actor.entityClass = DishonoredActor;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("dishonored", DishonoredCharacterSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("dishonored", DishonoredItemSheet, {makeDefault: true});

  // Register system settings
  // game.settings.register("worldbuilding", "macroShorthand", {
    // name: "Shortened Macro Syntax",
    // hint: "Enable a shortened macro syntax which allows referencing attributes directly, for example @str instead of @attributes.str.value. Disable this setting if you need the ability to reference the full attribute model, for example @attributes.str.label.",
    // scope: "world",
    // type: Boolean,
    // default: true,
    // config: true
  // });
});
