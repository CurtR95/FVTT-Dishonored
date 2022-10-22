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
    DishonoredTruthSheet
} from "./items/truth-sheet.js";
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
    const versionInfo = game.world.coreVersion;
    // Splash Screen
    console.info(`Initializing Dishonored Tabletop Roleplaying Game System
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
                                                      @@`);

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
            DishonoredTruthSheet,
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
    CONFIG.Actor.documentClass = DishonoredActor;
    CONFIG.Item.documentClass = DishonoredItem;

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
    Items.registerSheet("dishonored", DishonoredTruthSheet, {
        types: ["truth"],
    });

    // Code taken from FFG Star Wars which also flips their health system! (Plus
    // I like the increasing height that it implements)
    Token.prototype._drawBar = function (number, bar, data) {
        let val = Number(data.value);
        if (data.attribute === "stress") {
            val = Number(data.max - data.value);
        }
        const pct = Math.clamped(val, 0, data.max) / data.max;
        let h = Math.max(canvas.dimensions.size / 12, 8);
        if (this.data.height >= 2) h *= 1.6; // Enlarge the bar for large tokens
        // Draw the bar
        let color = number === 0 ? [
            1 - pct / 2,
            pct,
            0
        ] : [
            0.5 * pct,
            0.7 * pct,
            0.5 + pct / 2
        ];
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
        name: game.i18n.localize("dishonored.settings.names.multipleComplications"),
        hint: game.i18n.localize("dishonored.settings.hints.multipleComplications"),
        scope: "world",
        type: Boolean,
        default: true,
        config: true
    });

    game.settings.register("FVTT-Dishonored", "send2ActorPermissionLevel", {
        name: game.i18n.localize("dishonored.settings.names.send2ActorPermissionLevel"),
        hint: game.i18n.localize("dishonored.settings.hints.send2ActorPermissionLevel"),
        scope: "world",
        type: String,
        default: "ASSISTANT",
        config: true,
        choices: {
            "NONE": "Switch Off Send2Actor",
            "PLAYER": game.i18n.localize("USER.RolePlayer"),
            "TRUSTED": game.i18n.localize("USER.RoleTrusted"),
            "ASSISTANT": game.i18n.localize("USER.RoleAssistant"),
            "GAMEMASTER": game.i18n.localize("USER.RoleGamemaster"),
        }
    });

    game.settings.register("FVTT-Dishonored", "chaosPermissionLevel", {
        name: game.i18n.localize("dishonored.settings.names.chaosPermissionLevel"),
        hint: game.i18n.localize("dishonored.settings.hints.chaosPermissionLevel"),
        scope: "world",
        type: String,
        default: "ASSISTANT",
        config: true,
        choices: {
            "PLAYER": game.i18n.localize("USER.RolePlayer"),
            "TRUSTED": game.i18n.localize("USER.RoleTrusted"),
            "ASSISTANT": game.i18n.localize("USER.RoleAssistant"),
            "GAMEMASTER": game.i18n.localize("USER.RoleGamemaster"),
        }
    });

    game.settings.register("FVTT-Dishonored", "momentumPermissionLevel", {
        name: game.i18n.localize("dishonored.settings.names.momentumPermissionLevel"),
        hint: game.i18n.localize("dishonored.settings.hints.momentumPermissionLevel"),
        scope: "world",
        type: String,
        default: "PLAYER",
        config: true,
        choices: {
            "PLAYER": game.i18n.localize("USER.RolePlayer"),
            "TRUSTED": game.i18n.localize("USER.RoleTrusted"),
            "ASSISTANT": game.i18n.localize("USER.RoleAssistant"),
            "GAMEMASTER": game.i18n.localize("USER.RoleGamemaster"),
        }
    });

    game.settings.register("FVTT-Dishonored", "maxNumberOfExperience", {
        name: game.i18n.localize("dishonored.settings.names.maxNumberOfExperience"),
        hint: game.i18n.localize("dishonored.settings.hints.maxNumberOfExperience"),
        scope: "world",
        type: Number,
        default: 30,
        config: true
    });

    game.settings.register("FVTT-Dishonored", "trackerRefreshRate", {
        name: game.i18n.localize("dishonored.settings.names.trackerRefreshRate"),
        hint: game.i18n.localize("dishonored.settings.hints.trackerRefreshRate"),
        scope: "world",
        type: Number,
        default: 5,
        config: true
    });

    game.settings.register("FVTT-Dishonored", "ignoreTrackerPermissionsAlert", {
        scope: "world",
        type: Boolean,
        default: false,
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

    game.settings.register("FVTT-Dishonored", "currentMigrationVersion", {
        scope: "world",
        type: String,
        default: 0,
        config: false
    });

    Hooks.on("ready", function() {
        var currentMigVer = game.settings.get("FVTT-Dishonored", "currentMigrationVersion") == 0 ? "0.4.1": game.settings.get("FVTT-Dishonored", "currentMigrationVersion");

        if (isNewerVersion(game.system.version, currentMigVer ?? "0.4.1")) {
            ui.notifications.notify("Current Migration Version does not match Current Version, running Migration Script.");
            console.info("Current Migration Version does not match Current Version, running Migration Script.");
            game.dishonored.migration(currentMigVer);
        }
        let i;
        let error;
        if (isNewerVersion(versionInfo,"0.8.-1")) {
            i = foundry.CONST.USER_ROLES[game.settings.get("FVTT-Dishonored", "momentumPermissionLevel")];
        }
        else {
            i = USER_ROLES[game.settings.get("FVTT-Dishonored", "momentumPermissionLevel")];
        }
        for (i; i <= 4; i++) {
            if (!game.permissions.SETTINGS_MODIFY.includes(i)) {
                error = "momentum";
            }
        }
        if (isNewerVersion(versionInfo,"0.8.-1")) {
            i = foundry.CONST.USER_ROLES[game.settings.get("FVTT-Dishonored", "chaosPermissionLevel")];
        }
        else {
            i = USER_ROLES[game.settings.get("FVTT-Dishonored", "chaosPermissionLevel")];
        }
        for (i; i <= 4; i++) {
            if (!game.permissions.SETTINGS_MODIFY.includes(i)) {
                error = "chaos";
            }
        }
        if (error) {
            let string = "";
            string += "<span style=\"text-align: center\">";
            string += game.i18n.localize("dishonored.notifications."+error+".trackerPermissions1");
            string += "<span style=\"font-weight: bold; color: #ffaaaa; text-decoration: underline; cursor: pointer;\"  onclick=\"a = new PermissionConfig(); a.render(true)\">";
            string += game.i18n.localize("PERMISSION.Title");
            string += "</span>";
            string += game.i18n.localize("dishonored.notifications.trackerPermissions2");
            string += error == "momentum" ? game.settings.get("FVTT-Dishonored", "momentumPermissionLevel") : game.settings.get("FVTT-Dishonored", "chaosPermissionLevel");
            string += game.i18n.localize("dishonored.notifications."+error+".trackerPermissions3");
            string += "<span style=\"font-weight: bold; color: #ffaaaa; text-decoration: underline; cursor: pointer;\" onclick=\"a = new SettingsConfig(); a._tabs[0].active = 'system'; a.render(true);\">"+game.i18n.localize("SETTINGS.TabSystem")+"</span>";
            string += game.i18n.localize("dishonored.notifications.trackerPermissions4");
            let tmp = document.createElement("DIV");
            tmp.innerHTML = string;
            console.error(tmp.textContent);
            if (game.settings.get("FVTT-Dishonored", "ignoreTrackerPermissionsAlert") == false && game.user.isGM ) {
                string +="</br><span style=\"font-weight: bold; color: #ffaaaa; text-decoration: underline; cursor: pointer;\" onclick=\"game.settings.set('FVTT-Dishonored', 'ignoreTrackerPermissionsAlert', 'true');\"> ";
                string += game.i18n.localize("dishonored.notifications.trackerPermissionsClickHere");
                string += "</span></span>";
                ui.notifications.error(string,{"permanent":true});
            }
        }
        let t = new DishonoredTracker();
        renderTemplate("systems/FVTT-Dishonored/templates/apps/tracker.html").then(function() {
            t.render(true);
        });
        let l = new DishonoredLogo();
        renderTemplate("systems/FVTT-Dishonored/templates/apps/logo.html").then(function() {
            l.render(true);
        });
    });

    game.dishonored.migration = function(currentMigVer) {
        var recheck = false;
        switch (currentMigVer) {
        case "0.4.1":
            ui.notifications.notify("Migrating from 0.4.1 to 0.5.0");
            console.info("Migrating from 0.4.1 to 0.5.0");
            game.actors.forEach(function(actor) {
                if (actor.data.type == "character") {
                    if (actor.data.data.truth1) actor.createOwnedItem({name:actor.data.data.truth1, type: "truth", img:"systems/FVTT-Dishonored/icons/dishonoredDefaultLogo.webp"});
                    if (actor.data.data.truth2) actor.createOwnedItem({name:actor.data.data.truth2, type: "truth", img:"systems/FVTT-Dishonored/icons/dishonoredDefaultLogo.webp"});
                }
            });
            game.settings.set("FVTT-Dishonored", "currentMigrationVersion", "0.5.0");
            currentMigVer = "0.5.0";
            recheck = true;
            break;
        case "0.5.0":
            ui.notifications.notify("No Migration required from 0.5.0 to 0.5.1");
            console.info("No Migration required from 0.5.0 to 0.5.1");
            game.settings.set("FVTT-Dishonored", "currentMigrationVersion", "0.5.1");
            currentMigVer = "0.5.1";
            recheck = true;
            break;
        case "0.5.1":
            ui.notifications.notify("Migrating from 0.5.1 to 0.5.2");
            console.info("Migrating from 0.5.1 to 0.5.2");
            game.actors.forEach(function(actor) {
                if (actor.img == "icons/svg/mystery-man.svg" || actor.img == "systems/FVTT-Dishonored/icons/dishonoredDefaultLogo.webp" ) {
                    actor.update({"img": "/systems/FVTT-Dishonored/icons/dishonoredDefaultLogo.webp"});
                }
                actor.data.items.forEach(function(item) {
                    if (item.img == "icons/svg/mystery-man.svg" || item.img == "icons/svg/item-bag.svg" || item.img == "/systems/FVTT-Dishonored/icons/dishonoredlogo.webp" ) {
                        item.update({"img": "/systems/FVTT-Dishonored/icons/dishonoredDefaultLogo.webp"});
                    }
                });
            });
            game.settings.set("FVTT-Dishonored", "currentMigrationVersion", "0.5.2");
            currentMigVer = "0.5.2";
            recheck = true;
            break;
        case "0.5.2":
            currentMigVer = "0.6.0";
            game.settings.set("FVTT-Dishonored", "currentMigrationVersion", "0.6.0");
            recheck = true;
        default:
            recheck = false;
            break;
        }
        if (recheck == true) {game.dishonored.migration(currentMigVer);}
    };
});
