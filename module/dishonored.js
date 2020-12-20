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
import { 
    DishonoredTracker 
} from "./apps/tracker.js";
import { 
    DishonoredLogo
} from "./apps/logo.js";
import * as macros 
from "./macro.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", function() {
    // Splash Screen
    console.log(`Initializing Dishonored Tabletop Roleplaying Game System
                                                            @@
             @                                            @@
    @         @@                     @      @@         @@@@
      @@       @@@                 @@@   @@@        @@@@
        @@@@     @@@@@@@@@@@@@@@@@@@@    @@      @@@@@
          @@@@    @@@@            @@   @@@     @@@@@
            @@@@@   @     @@@@@@@@   @@@    @@@@@      @@
      @@@      @@@@ @@@@@@@       @@@@@  @@@@@@    @@@@
          @@@@    @@@@              @ @@@@@@   @@@@@
              @@@@   @              @@@@@@  @@@  @@@
                        @@@@@@@@@@@@@@@@          @@@
                      @@@@        @@@@            @@@
                      @@    @@@@@   @@@  @@@@@     @@
                            @@@@   @@@   @@@@@     @@
                        @@@       @@@@            @@@
            @@@@  @  @@@@@@@@@@@@@@               @@
            @@ @@  @@@@@                         @@@
                 @@@@                    @@    @@@
                @@                         @@@@@@
              @                              @@@@
                                                @@@
                                                   @@@
                                                      @@`)


    // Create a namespace within the game global
    game.dishonored = {
        applications: {
            DishonoredCharacterSheet,
            DishonoredNPCSheet,
            DishonoredItemSheet,
            DishonoredFocusSheet,
            DishonoredBonecharmSheet,
            DishonoredWeaponSheet,
            DishonoredArmorSheet,
            DishonoredTalentSheet,
            DishonoredContactSheet,
            DishonoredPowerSheet,
        },
        entities: {
            DishonoredActor,
        },
        macros: macros,
        skillTest: macros.skillTest
    };

    // Define initiative for the system.
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
        name: game.i18n.localize('dishonored.settings.names.multipleComplications'),
        hint: game.i18n.localize('dishonored.settings.hints.multipleComplications'),
        scope: "world",
        type: Boolean,
        default: true,
        config: true
    });

    game.settings.register("FVTT-Dishonored", "send2ActorPermissionLevel", {
        name: game.i18n.localize('dishonored.settings.names.send2ActorPermissionLevel'),
        hint: game.i18n.localize('dishonored.settings.hints.send2ActorPermissionLevel'),
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

    game.settings.register("FVTT-Dishonored", "chaosPermissionLevel", {
        name: game.i18n.localize('dishonored.settings.names.chaosPermissionLevel'),
        hint: game.i18n.localize('dishonored.settings.hints.chaosPermissionLevel'),
        scope: "world",
        type: String,
        default: "ASSISTANT",
        config: true,
        choices: {
          "PLAYER": "Players",
          "TRUSTED": "Trusted Players",
          "ASSISTANT": "Assistant Gamemaster",
          "GAMEMASTER": "Gamemasters",
        }
    });

    game.settings.register("FVTT-Dishonored", "momentumPermissionLevel", {
        name: game.i18n.localize('dishonored.settings.names.momentumPermissionLevel'),
        hint: game.i18n.localize('dishonored.settings.hints.momentumPermissionLevel'),
        scope: "world",
        type: String,
        default: "PLAYER",
        config: true,
        choices: {
          "PLAYER": "Players",
          "TRUSTED": "Trusted Players",
          "ASSISTANT": "Assistant Gamemaster",
          "GAMEMASTER": "Gamemasters",
        }
    });

    game.settings.register("FVTT-Dishonored", "maxNumberOfExperience", {
        name: game.i18n.localize('dishonored.settings.names.maxNumberOfExperience'),
        hint: game.i18n.localize('dishonored.settings.hints.maxNumberOfExperience'),
        scope: "world",
        type: Number,
        default: 30,
        config: true
    });

    game.settings.register("FVTT-Dishonored", "trackerRefreshRate", {
        name: game.i18n.localize('dishonored.settings.names.trackerRefreshRate'),
        hint: game.i18n.localize('dishonored.settings.hints.trackerRefreshRate'),
        scope: "world",
        type: Number,
        default: 5,
        config: true
    });

    game.settings.register("FVTT-Dishonored", "chaos", {
        scope: "world",
        type: Number,
        default: 0,
        config: false
    });

    game.settings.register("FVTT-Dishonored", "momentum", {
        scope: "world",
        type: Number,
        default: 0,
        config: false
    });

    Hooks.on("ready", function() {
        let i = USER_ROLES[game.settings.get("FVTT-Dishonored", "momentumPermissionLevel")];
        for (i; i <= 4; i++) {
            if (!game.permissions.SETTINGS_MODIFY.includes(i)) var error = true;
        }
        if (error) {
            console.error(game.i18n.localize('dishonored.notifications.momentumTrackerPermissions'));
            ui.notifications.error(game.i18n.localize('dishonored.notifications.momentumTrackerPermissions'));
        }
        let t = new DishonoredTracker()
        renderTemplate("systems/FVTT-Dishonored/templates/apps/tracker.html").then(html => {
            t.render(true);
        });
        let l = new DishonoredLogo()
        renderTemplate("systems/FVTT-Dishonored/templates/apps/logo.html").then(html => {
            l.render(true);
        });
    });
});