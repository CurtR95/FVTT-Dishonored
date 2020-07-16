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
  console.log(`Initializing Dishonored Tabletop Roleplaying Game System`);

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
  game.settings.register("FVTT-Dishonored", "multipleComplications", {
    name: "Allow Multiple Complications",
    hint: "As the rulebook is slightly unclear, allow multiple complications to happen?",
    scope: "world",
    type: Boolean,
    default: true,
    config: true
  });
});
