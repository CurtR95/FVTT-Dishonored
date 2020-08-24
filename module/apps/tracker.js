export class DishonoredTracker extends Application {

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "systems/FVTT-Dishonored/templates/apps/tracker.html";
        options.popOut = false;
        options.resizable = false;
        return options;
    }
    
    activateListeners(html) {
        let stat = game.settings.get("FVTT-Dishonored", "stat");
        renderTracker()
        this.checkUpdates();

        if (!game.user.hasRole(game.settings.get("FVTT-Dishonored", "trackerPermissionLevel"))) {
            html.find('.dishonored-impermitable')[0].style.display = 'none';
            html.find('.dishonored-impermitable')[1].style.display = 'none';
            html.find('#dishonored-track-stat')[0].disabled = true;
            return false;
        }

        html.find('#dishonored-track-decrease').click(ev => {
            stat = parseInt(document.getElementById("dishonored-track-stat").value);
            if (stat===0) {
                ui.notifications.warn("You can't set Chaos to a value below 0!");
                return false;
            }
            stat = stat - 1;
            game.settings.set("FVTT-Dishonored", "stat",stat);
            renderTracker();
        });

        html.find('#dishonored-track-increase').click(ev => {
            if (stat===99999999) {
                ui.notifications.error("THERE IS TOO MUCH CHAOS!");
                return false;
            }
            stat = parseInt(document.getElementById("dishonored-track-stat").value);
            stat = stat + 1;
            game.settings.set("FVTT-Dishonored", "stat",stat);
            renderTracker();
        });

        html.find('#dishonored-track-stat').keydown(ev => {
            if (ev.keyCode == 13) {
                html.find('#dishonored-track-stat').blur();
            }   
        })

        html.find('#dishonored-track-stat').change(ev => {
            if (document.getElementById("dishonored-track-stat").value < 0) {
                document.getElementById("dishonored-track-stat").value = stat;
                ui.notifications.warn("You can't set Chaos to a value below 0!");
                return false;
            }
            if (document.getElementById("dishonored-track-stat").value > 99999999) {
                document.getElementById("dishonored-track-stat").value = stat;
                ui.notifications.error("THAT IS TOO MUCH CHAOS!");
                return false;
            }
            stat = document.getElementById("dishonored-track-stat").value;
            game.settings.set("FVTT-Dishonored", "stat", stat);
            renderTracker();
        });

        function renderTracker() {
            document.getElementById("dishonored-track-stat").value = stat;
        }

    }

    async checkUpdates(stat) {
        let refreshRate = game.settings.get("FVTT-Dishonored", "trackerRefreshRate") * 1000;
        function check() {
            let stat = document.getElementById("dishonored-track-stat").value;
            let storedStat = game.settings.get("FVTT-Dishonored", "stat");
            if ($("#dishonored-track-stat").is(':focus') == false) {
                if (storedStat != stat) {
                    document.getElementById("dishonored-track-stat").value = storedStat;
                }
            }
            setTimeout(check, refreshRate);
        }
        check();
    }
}