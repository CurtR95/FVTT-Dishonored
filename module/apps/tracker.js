export class DishonoredTracker extends Application {

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "systems/FVTT-Dishonored/templates/apps/tracker.html";
        options.popOut = false;
        options.resizable = false;
        return options;
    }

    activateListeners(html) {
        // Define variables chaos and momentum as the game settings defined in dishonored.js
        let chaos = game.settings.get("FVTT-Dishonored", "chaos");
        let momentum = game.settings.get("FVTT-Dishonored", "momentum");
        // Fire renderTracker once which populates the Momentum and Chaos windows, then consistently check for updates, this should be seperate as we want the check function to be asyncherous.
        renderTracker()
        this.checkUpdates();

        // Hide the increase and decrease buttons if the user doesn't have permissions.
        if (!game.user.hasRole(game.settings.get("FVTT-Dishonored", "chaosPermissionLevel"))) {
            html.find('#dishonored-chaos-track-decrease')[0].style.display = 'none';
            html.find('#dishonored-chaos-track-increase')[0].style.display = 'none';
            html.find('#dishonored-track-chaos')[0].disabled = true;
        }

        // Hide the increase and decrease buttons if the user doesn't have permissions.
        if (!game.user.hasRole(game.settings.get("FVTT-Dishonored", "momentumPermissionLevel"))) {
            html.find('#dishonored-momentum-track-decrease')[0].style.display = 'none';
            html.find('#dishonored-momentum-track-increase')[0].style.display = 'none';
            html.find('#dishonored-track-momentum')[0].disabled = true;
        }

        // Find the button which has the class #dishonored-chaos-track-increase and tie the following to the onClick
        html.find('#dishonored-chaos-track-increase').click(ev => {
            // Check if the player has permissions before moving on!
            if (game.user.hasRole(game.settings.get("FVTT-Dishonored", "chaosPermissionLevel"))) {
                // Set momentum, we do this as otherwise when we render the tracker it will use the old initial load momentum (THANKS mkscho63)
                momentum = game.settings.get("FVTT-Dishonored", "momentum");
                chaos = parseInt(document.getElementById("dishonored-track-chaos").value);
                // Check if chaos is currently 99999999, anything past this is unable to render. If it is error. This is a meme.
                if (chaos === 99999999) {
                    ui.notifications.error(game.i18n.localize('dishonored.notifications.chaosGreater'));
                    return false;
                }
                // Otherwise we are good to add +1 and set the value and re-render the track.
                chaos = chaos + 1;
                game.settings.set("FVTT-Dishonored", "chaos", chaos);
                renderTracker();
            }
            // If the played does not have permissions - error!
            else {
                ui.notifications.error(game.i18n.localize('dishonored.notifications.chaosButtonInvalidPermissions'));
                return false;
            }
        });

        // Find the button which has the class #dishonored-momentum-track-increase and tie the following to the onClick
        html.find('#dishonored-momentum-track-increase').click(ev => {
            // Check if the player has permissions before moving on!
            if (game.user.hasRole(game.settings.get("FVTT-Dishonored", "momentumPermissionLevel"))) {
                // Set chaos, we do this as otherwise when we render the tracker it will use the old initial load chaos (THANKS mkscho63)
                chaos = game.settings.get("FVTT-Dishonored", "chaos");
                momentum = parseInt(document.getElementById("dishonored-track-momentum").value);
                // check if momentum is currently 6, if so it cannot be increased so error.
                if (momentum === 6) {
                    ui.notifications.error(game.i18n.localize('dishonored.notifications.momentumGreater'));
                    return false;
                }
                // Otherwise we are good to add +1 and set the value and re-render the track.
                momentum = momentum + 1;
                game.settings.set("FVTT-Dishonored", "momentum", momentum);
                renderTracker();
            }
            // If the played does not have permissions - error!
            else {
                ui.notifications.error(game.i18n.localize('dishonored.notifications.momentumButtonInvalidPermissions'));
                return false;
            }
        });

        html.find('#dishonored-chaos-track-decrease').click(ev => {
            // Check if the player has permissions before moving on!
            if (game.user.hasRole(game.settings.get("FVTT-Dishonored", "chaosPermissionLevel"))) {
                // Set momentum, we do this as otherwise when we render the tracker it will use the old initial load momentum (THANKS mkscho63)
                momentum = game.settings.get("FVTT-Dishonored", "momentum");
                chaos = parseInt(document.getElementById("dishonored-track-chaos").value);
                // check if chaos is currently 0, if so it cannot be decreased so error.
                if (chaos === 0) {
                    ui.notifications.warn(game.i18n.localize('dishonored.notifications.chaosLess'));
                    return false;
                }
                // Otherwise we are good to take -1 and set the value and re-render the track.
                chaos = chaos - 1;
                game.settings.set("FVTT-Dishonored", "chaos", chaos);
                renderTracker();
            }
            // If the played does not have permissions - error!
            else {
                ui.notifications.error(game.i18n.localize('dishonored.notifications.chaosButtonInvalidPermissions'));
                return false;
            }
        });

        html.find('#dishonored-momentum-track-decrease').click(ev => {
            // Check if the player has permissions before moving on!
            if (game.user.hasRole(game.settings.get("FVTT-Dishonored", "momentumPermissionLevel"))) {
                // Set chaos, we do this as otherwise when we render the tracker it will use the old initial load chaos (THANKS mkscho63)
                chaos = game.settings.get("FVTT-Dishonored", "chaos");
                momentum = parseInt(document.getElementById("dishonored-track-momentum").value);
                // check if momentum is currently 0, if so it cannot be decreased so error.
                if (momentum === 0) {
                    ui.notifications.warn(game.i18n.localize('dishonored.notifications.momentumLess'));
                    return false;
                }
                // Otherwise we are good to take -1 and set the value and re-render the track.
                momentum = momentum - 1;
                game.settings.set("FVTT-Dishonored", "momentum", momentum);
                renderTracker();
            }
            // If the played does not have permissions - error!
            else {
                ui.notifications.error(game.i18n.localize('dishonored.notifications.momentumButtonInvalidPermissions'));
                return false;
            }
        });

        // We want it so that we unfocus if the enter key is pressed, we do this by recording the keycode 13 and bluring.
        html.find('#dishonored-track-chaos').keydown(ev => {
            if (ev.keyCode == 13) {
                html.find('#dishonored-track-chaos').blur();
            }
        })

        html.find('#dishonored-track-momentum').keydown(ev => {
            if (ev.keyCode == 13) {
                html.find('#dishonored-track-momentum').blur();
            }
        })

        // This is what is fired when the chaos tracker text box is edited.
        html.find('#dishonored-track-chaos').change(ev => {
            // Check if the player has permissions before moving on!
            if (game.user.hasRole(game.settings.get("FVTT-Dishonored", "chaosPermissionLevel"))) {
                // Set chaos and momentum, we do this as otherwise when we render the tracker it will use the old initial load chaos (THANKS mkscho63)
                momentum = game.settings.get("FVTT-Dishonored", "momentum");
                chaos = game.settings.get("FVTT-Dishonored", "chaos");
                let len = document.getElementById("dishonored-track-chaos").value.length;
                // If the value is NaN and doesn't start with + or -, then error.
                if (isNaN(document.getElementById("dishonored-track-chaos").value) && document.getElementById("dishonored-track-chaos").value.substr(0,1) != "+" && document.getElementById("dishonored-track-chaos").value.substr(0,1) != "-") {
                    ui.notifications.error(game.i18n.localize('dishonored.notifications.NaN'));
                    document.getElementById("dishonored-track-chaos").value = chaos;
                }
                else {
                    // If a blank value is input, default to 0
                    if (document.getElementById("dishonored-track-chaos").value == '') {
                        document.getElementById("dishonored-track-chaos").value = 0;
                    }
                    // If a value begins with +, then add the two together
                    if (document.getElementById("dishonored-track-chaos").value.substr(0,1) == "+") {
                        // As we allow any + value through we want to check the rest is actually a number, this is caught here.
                        if (isNaN(document.getElementById("dishonored-track-chaos").value.substr(1,len-1))) {
                            ui.notifications.error(game.i18n.localize('dishonored.notifications.NaN'));
                            document.getElementById("dishonored-track-chaos").value = chaos;
                        }
                        else {
                            document.getElementById("dishonored-track-chaos").value = chaos + parseInt(document.getElementById("dishonored-track-chaos").value.substr(1,document.getElementById("dishonored-track-chaos").value.length - 1));
                        }
                    }
                    // If a value begins with -, then take the new value from the older.
                    if (document.getElementById("dishonored-track-chaos").value.substr(0,1) == "-") {
                        // As we allow any - value through we want to check the rest is actually a number, this is caught here.
                        if (isNaN(document.getElementById("dishonored-track-chaos").value.substr(1,len-1))) {
                            ui.notifications.error(game.i18n.localize('dishonored.notifications.NaN'));
                            document.getElementById("dishonored-track-chaos").value = chaos;
                        }
                        else {
                            document.getElementById("dishonored-track-chaos").value = chaos - parseInt(document.getElementById("dishonored-track-chaos").value.substr(1,document.getElementById("dishonored-track-chaos").value.length - 1));
                        }
                    }
                    // If the new value is going to be below 0, warn and return false.
                    if (document.getElementById("dishonored-track-chaos").value < 0) {
                        document.getElementById("dishonored-track-chaos").value = chaos;
                        ui.notifications.warn(game.i18n.localize('dishonored.notifications.chaosLess'));
                        return false;
                    }
                    // If the new value is going to be above 99999999, error and return false.
                    if (document.getElementById("dishonored-track-chaos").value > 99999999) {
                        document.getElementById("dishonored-track-chaos").value = chaos;
                        ui.notifications.error(game.i18n.localize('dishonored.notifications.chaosGreaterSet'));
                        return false;
                    }
                }
                // Set the value and re-render
                chaos = document.getElementById("dishonored-track-chaos").value;
                game.settings.set("FVTT-Dishonored", "chaos", chaos);
                renderTracker();
            }
            // If the played does not have permissions - error!
            else {
                ui.notifications.error(game.i18n.localize('dishonored.notifications.chaosButtonInvalidPermissions'));
                return false;
            }
        });

        // This is what is fired when the momentum tracker text box is edited.
        html.find('#dishonored-track-momentum').change(ev => {
            // Check if the player has permissions before moving on!
            if (game.user.hasRole(game.settings.get("FVTT-Dishonored", "momentumPermissionLevel"))) {
                // Set chaos and momentum, we do this as otherwise when we render the tracker it will use the old initial load chaos (THANKS mkscho63)
                momentum = game.settings.get("FVTT-Dishonored", "momentum");
                chaos = game.settings.get("FVTT-Dishonored", "chaos");
                // If the value is NaN and doesn't start with + or -, then error.
                if (isNaN(document.getElementById("dishonored-track-momentum").value) && document.getElementById("dishonored-track-momentum").value.substr(0,1) != "+" && document.getElementById("dishonored-track-momentum").value.substr(0,1) != "-") {
                    ui.notifications.error(game.i18n.localize('dishonored.notifications.NaN'));
                    document.getElementById("dishonored-track-momentum").value = momentum;
                }
                else {
                    // If a blank value is input, default to 0
                    if (document.getElementById("dishonored-track-momentum").value == '') {
                        document.getElementById("dishonored-track-momentum").value = 0;
                    }
                    // If a value begins with +, then add the two together
                    if (document.getElementById("dishonored-track-momentum").value.substr(0,1) == "+") {
                        // As we allow any + value through we want to check the rest is actually a number, this is caught here.
                        if (isNaN(document.getElementById("dishonored-track-momentum").value.substr(1,len-1))) {
                            ui.notifications.error(game.i18n.localize('dishonored.notifications.NaN'));
                            document.getElementById("dishonored-track-momentum").value = momentum;
                        }
                        else {
                            document.getElementById("dishonored-track-momentum").value = momentum + parseInt(document.getElementById("dishonored-track-momentum").value.substr(1,document.getElementById("dishonored-track-momentum").value.length - 1));
                        }
                    }
                    // If a value begins with -, then take the new value from the older.
                    if (document.getElementById("dishonored-track-momentum").value.substr(0,1) == "-") {
                        // As we allow any + value through we want to check the rest is actually a number, this is caught here.
                        if (isNaN(document.getElementById("dishonored-track-momentum").value.substr(1,len-1))) {
                            ui.notifications.error(game.i18n.localize('dishonored.notifications.NaN'));
                            document.getElementById("dishonored-track-momentum").value = momentum;
                        }
                        else {
                            document.getElementById("dishonored-track-momentum").value = momentum - parseInt(document.getElementById("dishonored-track-momentum").value.substr(1,document.getElementById("dishonored-track-momentum").value.length - 1));
                        }
                    }
                    // If the new value is going to be below 0, warn and return false.
                    if (document.getElementById("dishonored-track-momentum").value < 0) {
                        document.getElementById("dishonored-track-momentum").value = momentum;
                        ui.notifications.warn(game.i18n.localize('dishonored.notifications.momentumLess'));
                        return false;
                    }
                    // If the new value is going to be above 6, warn and return false.
                    if (document.getElementById("dishonored-track-momentum").value > 6) {
                        document.getElementById("dishonored-track-momentum").value = momentum;
                        ui.notifications.warn(game.i18n.localize('dishonored.notifications.momentumGreaterSet'));
                        return false;
                    }
                }
                // Set the value and re-render
                momentum = document.getElementById("dishonored-track-momentum").value;
                game.settings.set("FVTT-Dishonored", "momentum", momentum);
                renderTracker();
            }
            // If the played does not have permissions - error!
            else {
                ui.notifications.error(game.i18n.localize('dishonored.notifications.momentumButtonInvalidPermissions'));
                return false;
            }
        });

        // Set the element value to its respective variable.
        function renderTracker() {
            document.getElementById("dishonored-track-chaos").value = chaos;
            document.getElementById("dishonored-track-momentum").value = momentum;
        }

    }

    async checkUpdates() {
        // Grab the Refresh Rate from the system settings (*1000 as JS counts in ms)
        let refreshRate = game.settings.get("FVTT-Dishonored", "trackerRefreshRate") * 1000;
        // Create function that will cycle regularly
        function check() {
            // Define Chaos and Momentum as the value displayed and the storedChaos and Momentum as the value saved to the settings
            let chaos = document.getElementById("dishonored-track-chaos").value;
            let momentum = document.getElementById("dishonored-track-momentum").value;
            let storedChaos = game.settings.get("FVTT-Dishonored", "chaos");
            let storedMomentum = game.settings.get("FVTT-Dishonored", "momentum");
            // Get out clause that checks if the chaos or momentum is below 0 and if so, change it to 0. 
            if (storedChaos < 0) {
                game.settings.set("FVTT-Dishonored", "chaos", 0);
            }
            if (storedMomentum < 0) {
                game.settings.set("FVTT-Dishonored", "momentum", 0);
            }
            // Check if the field is currently focused, we don't want to interupt the user if they have the field focused!
            if ($("#dishonored-track-chaos").is(':focus') == false) {
                // If the displayed and stored value is not equal, make the displayed value equal the stored value!
                if (storedChaos != chaos) {
                    document.getElementById("dishonored-track-chaos").value = storedChaos;
                }
            }
            // Check if the field is currently focused, we don't want to interupt the user if they have the field focused!
            if ($("#dishonored-track-momentum").is(':focus') == false) {
                // If the displayed and stored value is not equal, make the displayed value equal the stored value!
                if (storedMomentum != momentum) {
                    document.getElementById("dishonored-track-momentum").value = storedMomentum;
                }
            }
            // Tell script to wait for refresh, and then fire this function again
            setTimeout(check, refreshRate);
        }
        // Initially fire the function.
        check();
    }
}
