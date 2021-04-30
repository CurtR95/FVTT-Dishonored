export class DishonoredContactSheet extends ItemSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["dishonored", "sheet", "item", "contact"],
            width: 500,
            height: 400,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }

    /* -------------------------------------------- */

    // If the player is not a GM and has limited permissions - send them to the limited sheet, otherwise, continue as usual.
    /** @override */
    get template() {
        if ( !game.user.isGM && this.item.limited) {
            ui.notifications.warn(game.i18n.localize("dishonored.notifications.lackPermission"));
            return;
        }
        return "systems/FVTT-Dishonored/templates/items/contact-sheet.html";
    }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        const data = this.object.data;
        data.dtypes = ["String", "Number", "Boolean"];

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

        // If the sheet is not editable, hide the Send2Actor button (as the player shouldn't be able to edit this!). Also bump up the size of the Description editor.
        if (!this.options.editable) {
            html.find(".send2actor")[0].style.display = "none";
            html.find(".description")[0].style.height = "calc(100% - 50px)";
            return;
        }

        // Check if the user has the role set in the system settings. If not hide the button from the user.
        if (!game.user.hasRole(game.settings.get("FVTT-Dishonored", "send2ActorPermissionLevel"))) {
            html.find(".send2actor")[0].style.display = "none";
        }
        else {
            html.find(".send2actor").click(ev => {
                // Grab the value of the name field, the editor content and the img src and send this to the send2Actor method.
                let name = html.find("#name")[0].value;
                let description = html.find(".editor-content")[0].innerHTML;
                let img = html.find(".img")[0].getAttribute("src");
                let localisedText = game.i18n.localize("dishonored.notifications.s2A");
                this.send2Actor(name, description, img).then(ui.notifications.info(localisedText.replace("|#|", name)));
            });
        }
    }

    // Create an actor with the name, img and notes set from the contact - the actor is hardcoded as NPC here.
    async send2Actor(name, description, img) {
        await Actor.create({
            name: name,
            type: "npc",
            img: img,
            sort: 12000,
            data: {
                notes: description
            },
            token: {},
            items: [],
            flags: {}
        });
    }
}