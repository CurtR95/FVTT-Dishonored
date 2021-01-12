// Import Modules
import {
    DishonoredActor
} from "./actors/actor.js";
import {
    DishonoredItem
} from "./items/item.js";
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
    CONFIG.Item.entityClass = DishonoredItem;

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

    // Code taken from FFG Star Wars which also flips their health system! (Plus I like the increasing height that it implements)
    Token.prototype._drawBar = function (number, bar, data) {
        let val = Number(data.value);
        if (data.attribute === "stress") {
          val = Number(data.max - data.value);
        }
        const pct = Math.clamped(val, 0, data.max) / data.max;
        let h = Math.max(canvas.dimensions.size / 12, 8);
        if (this.data.height >= 2) h *= 1.6; // Enlarge the bar for large tokens
        // Draw the bar
        let color = number === 0 ? [1 - pct / 2, pct, 0] : [0.5 * pct, 0.7 * pct, 0.5 + pct / 2];
        bar
          .clear()
          .beginFill(0x000000, 0.5)
          .lineStyle(2, 0x000000, 0.9)
          .drawRoundedRect(0, 0, this.w, h, 3)
          .beginFill(PIXI.utils.rgb2hex(color), 0.8)
          .lineStyle(1, 0x000000, 0.8)
          .drawRoundedRect(1, 1, pct * (this.w - 2), h - 2, 2);
        // Set position
        let posY = number === 0 ? this.h - h : 0;
        bar.position.set(0, posY);
      };

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