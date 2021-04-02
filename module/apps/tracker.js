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

        // Find the button which has the class #dishonored-chaos-track-increase and tie the following to the onClick
        html.find('#dishonored-chaos-track-increase').click(function() {
            // Check if the player has permissions before moving on!
            if (game.user.hasRole(game.settings.get("FVTT-Dishonored", "chaosPermissionLevel"))) {
                // Set momentum, we do this as otherwise when we render the tracker it will use the old initial load momentum (THANKS mkscho63)
                momentum = game.settings.get("FVTT-Dishonored", "momentum");
                chaos = parseInt(document.getElementById("dishonored-track-chaos").value);
                // Check if chaos is currently 99, anything past this is unable to render. If it does error it becomes a meme.
                if (chaos === 99) {
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

        html.find('#dishonored-chaos-track-decrease').click(function() {
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

        // We want it so that we unfocus if the enter key is pressed, we do this by recording the keycode 13 and bluring.
        html.find('#dishonored-track-chaos').keydown(ev => {
            if (ev.keyCode == 13) {
                html.find('#dishonored-track-chaos').blur();
            }
        })

        // This is what is fired when the chaos tracker text box is edited.
        html.find('#dishonored-track-chaos').change(function() {
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
                    // If the new value is going to be above 99, error and return false.
                    if (document.getElementById("dishonored-track-chaos").value > 99) {
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

        html.find('[id^="dishonored-momentum-tracker"]').click(ev => {
            momentum = game.settings.get("FVTT-Dishonored", "momentum");
            chaos = game.settings.get("FVTT-Dishonored", "chaos");
            let captureObject = $(ev.currentTarget)[0];
            let newTotalObjectBG = html.find('#' + captureObject.id.substr(0,captureObject.id.length-2) + 'bg')[0];
            let newTotal = captureObject.id.replace(/\D/g, '');
            // data-selected stores whether the track box is currently activated or not. This checks that the box is activated
            if (newTotalObjectBG.getAttribute("data-selected") === "true") {
                // Now we check that the "next" track box is not activated. 
                // If there isn't one, or it isn't activated, we only want to decrease the value by 1 rather than setting the value.
                let nextCheck = 'dishonored-momentum-tracker-' + (parseInt(newTotal) + 1 + '-bg');
                if (!html.find('#'+nextCheck)[0] || html.find('#'+nextCheck)[0].getAttribute("data-selected") != "true") {
                    momentum = momentum - 1;
                    game.settings.set("FVTT-Dishonored", "momentum", momentum);
                    renderTracker()
                } 
                // If it isn't caught by the if, the next box is likely activated. If something happened, its safer to set the value anyway.
                else {
                    // let total = html.find('#total-exp')[0].value;
                    if (momentum != newTotal) {
                        momentum = newTotal;
                        game.settings.set("FVTT-Dishonored", "momentum", momentum);
                        renderTracker()
                    }
                }
            } 
            // If the clicked box wasn't activated, we need to activate it now.
            else {
                if (momentum != newTotal) {
                    momentum = newTotal;
                    game.settings.set("FVTT-Dishonored", "momentum", momentum);
                    renderTracker()
                }
            }
        });

        // Set the element value to its respective variable.
        function renderTracker() {
            document.getElementById("dishonored-track-chaos").value = chaos;
            for (let i=1;i<=6;i++) {
                if (i<=momentum) {
                    html.find('#dishonored-momentum-tracker-'+i+'-bg')[0].setAttribute("data-selected", "true");
                    html.find('#dishonored-momentum-tracker-'+i+'-bg')[0].style.fill = "white";
                    html.find('#dishonored-momentum-tracker-'+i+'-fg')[0].style.color = "";
                    html.find('#dishonored-momentum-tracker-'+i+'-fg')[0].style.textShadow = "";
                }
                else {
                    html.find('#dishonored-momentum-tracker-'+i+'-bg')[0].removeAttribute("data-selected");
                    html.find('#dishonored-momentum-tracker-'+i+'-bg')[0].style.fill = "";
                    html.find('#dishonored-momentum-tracker-'+i+'-fg')[0].style.color = "white";
                    html.find('#dishonored-momentum-tracker-'+i+'-fg')[0].style.textShadow = "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
                }
            }
        }
    }

    async checkUpdates() {
        // We use i in loops, defining at top-level
        let i;
        // Grab the Refresh Rate from the system settings (*1000 as JS counts in ms)
        let refreshRate = game.settings.get("FVTT-Dishonored", "trackerRefreshRate") * 1000;
        // Create function that will cycle regularly
        setInterval(function check() {
            // Define Chaos and Momentum as the value displayed and the storedChaos and Momentum as the value saved to the settings
            let chaos = document.getElementById("dishonored-track-chaos").value;
            let momentum;
            for (i=1;i<=6;i++) {
                if (document.getElementById('dishonored-momentum-tracker-'+i+'-bg').getAttribute("data-selected")==="true") {
                    momentum = i;
                }
            }
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

            if (storedMomentum != momentum) {
                for (i=1;i<=6;i++) {
                    if (i<=storedMomentum) {
                        document.getElementById('dishonored-momentum-tracker-'+i+'-bg').setAttribute("data-selected", "true");
                        document.getElementById('dishonored-momentum-tracker-'+i+'-bg').style.fill = "white";
                        document.getElementById('dishonored-momentum-tracker-'+i+'-fg').style.color = '';
                        document.getElementById('dishonored-momentum-tracker-'+i+'-fg').style.textShadow = '';
                    }
                    else {
                        document.getElementById('dishonored-momentum-tracker-'+i+'-bg').removeAttribute("data-selected");
                        document.getElementById('dishonored-momentum-tracker-'+i+'-bg').style.fill = "";
                        document.getElementById('dishonored-momentum-tracker-'+i+'-fg').style.color = 'white';
                        document.getElementById('dishonored-momentum-tracker-'+i+'-fg').style.textShadow = '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black';
                    }
                }
            }  
        }, refreshRate);
    }
}
