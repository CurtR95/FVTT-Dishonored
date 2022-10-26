export class DishonoredFocusSheet extends ItemSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["dishonored", "sheet", "item", "focus"],
            width: 500,
            height: 200,
            tabs: [{
                navSelector: ".sheet-tabs",
                contentSelector: ".sheet-body",
                initial: "description",
            }]
        });
    }

    /* -------------------------------------------- */

    /** @override */
    get template() {
        // If the player is not a GM and has limited permissions - send them to
        // the limited sheet, otherwise, continue as usual.
        if ( !game.user.isGM && this.item.limited) {
            ui.notifications.warn(
                game.i18n.localize("dishonored.notifications.lackPermission")
            );

            return;
        }
        return "systems/FVTT-Dishonored/templates/items/focus-sheet.html";
    }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        const data = this.object;
        data.dtypes = ["String", "Number", "Boolean"];

        // Checks if the rating of the focus is above 5 or 2. If it exceeds
        // these bounds it sets it to the closest limit. (i.e. 1 is set to 2)
        if (data.system.rating > 5) data.system.rating = 5;
        if (data.system.rating < 2) data.system.rating = 2;

        return data;
    }

    /* -------------------------------------------- */

    /** @override */
    setPosition(options = {}) {
        const position = super.setPosition(options);
        const sheetBody = this.element.find(".sheet-body");
        const bodyHeight = position.height - 192;
        sheetBody.css("height", bodyHeight);
        return position;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;
    }

}
