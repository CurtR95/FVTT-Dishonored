// Import Modules
import {
    DishonoredActor
} from "./actors/actor.js";
import {
    DishonoredCharacterSheet
} from "./actors/sheets/character-sheet.js";
import {
    DishonoredNPCSheet
} from "./actors/sheets/npc-sheet.js";
import {
    DishonoredItemSheet
} from "./items/item-sheet.js";
import {
    DishonoredFocusSheet
} from "./items/focus-sheet.js";
import {
    DishonoredBonecharmSheet
} from "./items/bonecharm-sheet.js";
import {
    DishonoredWeaponSheet
} from "./items/weapon-sheet.js";
import {
    DishonoredArmorSheet
} from "./items/armor-sheet.js";
import {
    DishonoredTalentSheet
} from "./items/talent-sheet.js";
import {
    DishonoredContactSheet
} from "./items/contact-sheet.js";
import {
    DishonoredPowerSheet
} from "./items/power-sheet.js";

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
    Actors.registerSheet("dishonored", DishonoredCharacterSheet, {
        types: ["character"],
        makeDefault: true
    });
    Actors.registerSheet("dishonored", DishonoredNPCSheet, {
        types: ["npc"]
    });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("dishonored", DishonoredItemSheet, {
        types: ["item"],
        makeDefault: true
    });
    Items.registerSheet("dishonored", DishonoredFocusSheet, {
        types: ["focus"],
    });
    Items.registerSheet("dishonored", DishonoredBonecharmSheet, {
        types: ["bonecharm"],
    });
    Items.registerSheet("dishonored", DishonoredWeaponSheet, {
        types: ["weapon"],
    });
    Items.registerSheet("dishonored", DishonoredArmorSheet, {
        types: ["armor"],
    });
    Items.registerSheet("dishonored", DishonoredTalentSheet, {
        types: ["talent"],
    });
    Items.registerSheet("dishonored", DishonoredContactSheet, {
        types: ["contact"],
    });
    Items.registerSheet("dishonored", DishonoredPowerSheet, {
        types: ["power"],
    });

    // Register system settings
    game.settings.register("FVTT-Dishonored", "multipleComplications", {
        name: 'Multiple Complications:',
        hint: 'The rulebook states "Any die which rolled 20 causes a complication". This is slightly unclear and as of Version 8 of the PDF, this is still not clear - likely due to the incredible rarity. Enabling this will allow roles to display "There were x Complications" if multiple 20s are rolled. Disabling will just state a single complication.',
        scope: "world",
        type: Boolean,
        default: true,
        config: true
    });

    game.settings.register("FVTT-Dishonored", "send2ActorPermissionLevel", {
        name: 'Send2Actor User Role:',
        hint: 'The contact item type has the ability to create an NPC, who should be allowed to see & use this functionality?',
        scope: "world",
        type: String,
        default: "ASSISTANT",
        config: true,
        choices: {
          "NONE": "Switch Off Send2Actor",
          "PLAYER": "Players",
          "TRUSTED": "Trusted Players",
          "ASSISTANT": "Assistant Gamemaster",
          "GAMEMASTER": "Gamemasters",
        }
    });
});