export class DishonoredTracker extends Application {

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "systems/FVTT-Dishonored/templates/apps/tracker.html";
        options.popOut = false;
        options.resizable = false;
        return options;
    }

    activateListeners(html) {
        let chaos = game.settings.get("FVTT-Dishonored", "chaos");
        let momentum = game.settings.get("FVTT-Dishonored", "momentum");
        renderTracker()
        this.checkUpdates();

        if (!game.user.hasRole(game.settings.get("FVTT-Dishonored", "chaosPermissionLevel"))) {
            html.find('#dishonored-chaos-track-decrease')[0].style.display = 'none';
            html.find('#dishonored-chaos-track-increase')[0].style.display = 'none';
            html.find('#dishonored-track-chaos')[0].disabled = true;
        }

        if (!game.user.hasRole(game.settings.get("FVTT-Dishonored", "momentumPermissionLevel"))) {
            html.find('#dishonored-momentum-track-decrease')[0].style.display = 'none';
            html.find('#dishonored-momentum-track-increase')[0].style.display = 'none';
            html.find('#dishonored-track-momentum')[0].disabled = true;
        }

        html.find('#dishonored-momentum-track-decrease').click(ev => {
            momentum = parseInt(document.getElementById("dishonored-track-momentum").value);
            if (momentum === 0) {
                ui.notifications.warn(game.i18n.localize('dishonored.notifications.MomentumLess'));
                return false;
            }
            momentum = momentum - 1;
            game.settings.set("FVTT-Dishonored", "momentum", momentum);
            renderTracker();
        });

        html.find('#dishonored-chaos-track-decrease').click(ev => {
            chaos = parseInt(document.getElementById("dishonored-track-chaos").value);
            if (chaos === 0) {
                ui.notifications.warn(game.i18n.localize('dishonored.notifications.ChaosLess'));
                return false;
            }
            chaos = chaos - 1;
            game.settings.set("FVTT-Dishonored", "chaos", chaos);
            renderTracker();
        });

        html.find('#dishonored-chaos-track-increase').click(ev => {
            if (chaos === 99999999) {
                ui.notifications.error(game.i18n.localize('dishonored.notifications.ChaosGreater'));
                return false;
            }
            chaos = parseInt(document.getElementById("dishonored-track-chaos").value);
            chaos = chaos + 1;
            game.settings.set("FVTT-Dishonored", "chaos", chaos);
            renderTracker();
        });

        html.find('#dishonored-momentum-track-increase').click(ev => {
            if (momentum === 6) {
                ui.notifications.error(game.i18n.localize('dishonored.notifications.MomentumGreater'));
                return false;
            }
            momentum = parseInt(document.getElementById("dishonored-track-momentum").value);
            momentum = momentum + 1;
            game.settings.set("FVTT-Dishonored", "momentum", momentum);
            renderTracker();
        });

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

        html.find('#dishonored-track-chaos').change(ev => {
            if (isNaN(document.getElementById("dishonored-track-chaos").value) && document.getElementById("dishonored-track-chaos").value.substr(0,1) != "+" && document.getElementById("dishonored-track-chaos").value.substr(0,1) != "-") {
                ui.notifications.error(game.i18n.localize('dishonored.notifications.NaN'));
                document.getElementById("dishonored-track-chaos").value = chaos;
            }
            else {
                if (document.getElementById("dishonored-track-chaos").value == '') {
                    document.getElementById("dishonored-track-chaos").value = 0;
                }
                if (document.getElementById("dishonored-track-chaos").value.substr(0,1) == "+") {
                    document.getElementById("dishonored-track-chaos").value = chaos + parseInt(document.getElementById("dishonored-track-chaos").value.substr(1,document.getElementById("dishonored-track-chaos").value.length - 1));
                }
                if (document.getElementById("dishonored-track-chaos").value.substr(0,1) == "-") {
                    document.getElementById("dishonored-track-chaos").value = chaos - parseInt(document.getElementById("dishonored-track-chaos").value.substr(1,document.getElementById("dishonored-track-chaos").value.length - 1));
                }
                if (document.getElementById("dishonored-track-chaos").value < 0) {
                    document.getElementById("dishonored-track-chaos").value = chaos;
                    ui.notifications.warn(game.i18n.localize('dishonored.notifications.ChaosLess'));
                    return false;
                }
                if (document.getElementById("dishonored-track-chaos").value > 99999999) {
                    document.getElementById("dishonored-track-chaos").value = chaos;
                    ui.notifications.error(game.i18n.localize('dishonored.notifications.ChaosGreaterSet'));
                    return false;
                }
            }
            chaos = document.getElementById("dishonored-track-chaos").value;
            game.settings.set("FVTT-Dishonored", "chaos", chaos);
            renderTracker();
        });

        html.find('#dishonored-track-momentum').change(ev => {
            if (isNaN(document.getElementById("dishonored-track-momentum").value)) {
                ui.notifications.error(game.i18n.localize('dishonored.notifications.NaN'));
                document.getElementById("dishonored-track-momentum").value = momentum;
            }
            else {
                if (document.getElementById("dishonored-track-momentum").value == '') {
                    document.getElementById("dishonored-track-momentum").value = 0;
                }
                if (document.getElementById("dishonored-track-momentum").value.substr(0,1) == "+") {
                    document.getElementById("dishonored-track-momentum").value = chaos + parseInt(document.getElementById("dishonored-track-chaos").value.substr(1,document.getElementById("dishonored-track-momentum").value.length - 1));
                }
                if (document.getElementById("dishonored-track-momentum").value.substr(0,1) == "-") {
                    document.getElementById("dishonored-track-momentum").value = chaos - parseInt(document.getElementById("dishonored-track-chaos").value.substr(1,document.getElementById("dishonored-track-momentum").value.length - 1));
                }
                if (document.getElementById("dishonored-track-momentum").value < 0) {
                    document.getElementById("dishonored-track-momentum").value = momentum;
                    ui.notifications.warn(game.i18n.localize('dishonored.notifications.MomentumLess'));
                    return false;
                }
                if (document.getElementById("dishonored-track-momentum").value > 6) {
                    document.getElementById("dishonored-track-momentum").value = momentum;
                    ui.notifications.error(game.i18n.localize('dishonored.notifications.MomentumGreaterSet'));
                    
                    return false;
                }
            }
            momentum = document.getElementById("dishonored-track-momentum").value;
            game.settings.set("FVTT-Dishonored", "momentum", momentum);
            renderTracker();
        });

        function renderTracker() {
            document.getElementById("dishonored-track-chaos").value = chaos;
            document.getElementById("dishonored-track-momentum").value = momentum;
        }

    }

    async checkUpdates() {
        let refreshRate = game.settings.get("FVTT-Dishonored", "trackerRefreshRate") * 1000;
        function check() {
            let chaos = document.getElementById("dishonored-track-chaos").value;
            let momentum = document.getElementById("dishonored-track-momentum").value;
            let storedChaos = game.settings.get("FVTT-Dishonored", "chaos");
            let storedMomentum = game.settings.get("FVTT-Dishonored", "momentum");

            if ($("#dishonored-track-chaos").is(':focus') == false) {
                if (storedChaos != chaos) {
                    document.getElementById("dishonored-track-chaos").value = storedChaos;
                }
            }
            if ($("#dishonored-track-momentum").is(':focus') == false) {
                if (storedMomentum != momentum) {
                    document.getElementById("dishonored-track-momentum").value = storedMomentum;
                }
            }
            setTimeout(check, refreshRate);
        }
        check();
    }
}