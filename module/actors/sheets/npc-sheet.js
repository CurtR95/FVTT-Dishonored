import {
    DishonoredRollDialog
} from '../../apps/roll-dialog.js'
import {
    DishonoredRoll
} from '../../roll.js'
/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class DishonoredNPCSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["dishonored", "sheet", "actor"],
            template: "systems/FVTT-Dishonored/templates/actors/character-sheet.html",
            width: 700,
            height: 600,
            tabs: [{
                navSelector: ".sheet-tabs",
                contentSelector: ".sheet-body",
                initial: "description"
            }],
            dragDrop: [{
                dragSelector: ".item-list .item",
                dropSelector: null
            }]
        });
    }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        const data = super.getData();
        data.dtypes = ["String", "Number", "Boolean"];
        for (let attr of Object.values(data.data.attributes)) {
            attr.isCheckbox = attr.dtype === "Boolean";
        }

        //Ensure skill and style values don't weigh over the max of 8 and minimum of 4.
        if (data.data.skills.fight.value > 8) data.data.skills.fight.value = 8;
        if (data.data.skills.move.value > 8) data.data.skills.move.value = 8;
        if (data.data.skills.study.value > 8) data.data.skills.study.value = 8;
        if (data.data.skills.survive.value > 8) data.data.skills.survive.value = 8;
        if (data.data.skills.talk.value > 8) data.data.skills.talk.value = 8;
        if (data.data.skills.tinker.value > 8) data.data.skills.tinker.value = 8;
        if (data.data.styles.boldly.value > 8) data.data.styles.boldly.value = 8;
        if (data.data.styles.carefully.value > 8) data.data.styles.carefully.value = 8;
        if (data.data.styles.cleverly.value > 8) data.data.styles.cleverly.value = 8;
        if (data.data.styles.forcefully.value > 8) data.data.styles.forcefully.value = 8;
        if (data.data.styles.quietly.value > 8) data.data.styles.quietly.value = 8;
        if (data.data.styles.swiftly.value > 8) data.data.styles.swiftly.value = 8;
        if (data.data.void.value > data.data.void.max) data.data.void.value = data.data.void.max;
        if (data.data.skills.fight.value < 4) data.data.skills.fight.value = 4;
        if (data.data.skills.move.value < 4) data.data.skills.move.value = 4;
        if (data.data.skills.study.value < 4) data.data.skills.study.value = 4;
        if (data.data.skills.survive.value < 4) data.data.skills.survive.value = 4;
        if (data.data.skills.talk.value < 4) data.data.skills.talk.value = 4;
        if (data.data.skills.tinker.value < 4) data.data.skills.tinker.value = 4;
        if (data.data.styles.boldly.value < 4) data.data.styles.boldly.value = 4;
        if (data.data.styles.carefully.value < 4) data.data.styles.carefully.value = 4;
        if (data.data.styles.cleverly.value < 4) data.data.styles.cleverly.value = 4;
        if (data.data.styles.forcefully.value < 4) data.data.styles.forcefully.value = 4;
        if (data.data.styles.quietly.value < 4) data.data.styles.quietly.value = 4;
        if (data.data.styles.swiftly.value < 4) data.data.styles.swiftly.value = 4;
        if (data.data.void.value < 0) data.data.void.value = 0;
        if (data.data.void.max < 1) data.data.void.value = 1;

        return data;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        var voidpointsmax = document.getElementById('max-void').value;
        var i;
        for (i = 1; i <= voidpointsmax; i++) {
            var div = document.createElement("DIV");
            div.className = "voidbox";
            div.id = "void-" + i;
            div.innerHTML = i;
            div.style = "width: calc(100% / " + document.getElementById('max-void').value + ");"
            document.getElementById('bar-void-renderer').appendChild(div);
            //   <div class="voidbox" id="void-1">1</div>
        }

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        // Add Inventory Item
        html.find('.item-create').click(ev => {
            event.preventDefault();
            const header = event.currentTarget;
            // Get the type of item to create.
            const type = header.dataset.type;
            // Grab any data associated with this control.
            const data = duplicate(header.dataset);
            // Initialize a default name.
            const name = `New ${type.capitalize()}`;
            // Prepare the item object.
            const itemData = {
                name: name,
                type: type,
                data: data
            };
            // Remove the type from the dataset since it's in the itemData.type prop.
            delete itemData.data["type"];

            // Finally, create the item!
            return this.actor.createOwnedItem(itemData);
        });

        // Update Inventory Item
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.getOwnedItem(li.data("itemId"));
            item.sheet.render(true);
        });

        // Delete Inventory Item
        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            this.actor.deleteOwnedItem(li.data("itemId"));
            li.slideUp(200, () => this.render(false));
        });

        html.find('[id^="mom"]').click(ev => {
            var newTotalObject = $(ev.currentTarget)[0];
            var newTotal = newTotalObject.id.substring(4);
            if (newTotalObject.getAttribute("data-value") == 1) {
                var nextCheck = 'mom-' + (parseInt(newTotal) + 1);
                if (!document.getElementById(nextCheck) || document.getElementById(nextCheck).getAttribute("data-value") != 1) {
                    document.getElementById('total-mom').value = document.getElementById('total-mom').value - 1;
                    barRenderer();
                } else {
                    var total = document.getElementById('total-mom').value;
                    if (total != newTotal) {
                        document.getElementById('total-mom').value = newTotal;
                        barRenderer();
                    }
                }
            } else {
                var total = document.getElementById('total-mom').value;
                if (total != newTotal) {
                    document.getElementById('total-mom').value = newTotal;
                    barRenderer();
                }
            }
        });

        html.find('[id^="stress"]').click(ev => {
            var newTotalObject = $(ev.currentTarget)[0];
            var newTotal = newTotalObject.id.substring(7);
            if (newTotalObject.getAttribute("data-value") == 1) {
                var nextCheck = 'stress-' + (parseInt(newTotal) + 1);
                if (!document.getElementById(nextCheck) || document.getElementById(nextCheck).getAttribute("data-value") != 1) {
                    document.getElementById('total-stress').value = document.getElementById('total-stress').value - 1;
                    barRenderer();
                    this.submit();
                } else {
                    var total = document.getElementById('total-stress').value;
                    if (total != newTotal) {
                        document.getElementById('total-stress').value = newTotal;
                        barRenderer();
                        this.submit();
                    }
                }
            } else {
                var total = document.getElementById('total-stress').value;
                if (total != newTotal) {
                    document.getElementById('total-stress').value = newTotal;
                    barRenderer();
                    this.submit();
                }
            }
        });

        html.find('[id^="void"]').click(ev => {
            var newTotalObject = $(ev.currentTarget)[0];
            var newTotal = newTotalObject.id.replace(/\D/g, '');
            if (newTotalObject.getAttribute("data-value") == 1) {
                var nextCheck = 'void-' + (parseInt(newTotal) + 1);
                if (!document.getElementById(nextCheck) || document.getElementById(nextCheck).getAttribute("data-value") != 1) {
                    document.getElementById('total-void').value = document.getElementById('total-void').value - 1;
                    barRenderer();
                    this.submit();
                } else {
                    var total = document.getElementById('total-void').value;
                    if (total != newTotal) {
                        document.getElementById('total-void').value = newTotal;
                        barRenderer();
                        this.submit();
                    }
                }
            } else {
                var total = document.getElementById('total-void').value;
                if (total != newTotal) {
                    document.getElementById('total-void').value = newTotal;
                    barRenderer();
                    this.submit();
                }
            }
        });

        html.find('[id="decrease-void-max"]').click(ev => {
            document.getElementById('max-void').value--;
            this.submit();
        });

        html.find('[id="increase-void-max"]').click(ev => {
            document.getElementById('max-void').value++;
            this.submit();
        });

        html.find('.skill-roll-selector').click(ev => {
            var i;
            for (i = 0; i <= 5; i++) {
                html.find('.skill-roll-selector')[i].checked = false;
                // html.find('.skill-roll-selector')[i].style.backgroundColor = "";
            }
            $(ev.currentTarget)[0].checked = true;
            // $(ev.currentTarget)[0].style.backgroundColor = "#191813";
        });

        html.find('.style-roll-selector').click(ev => {
            var i;
            for (i = 0; i <= 5; i++) {
                html.find('.style-roll-selector')[i].checked = false;
                // html.find('.style-roll-selector')[i].style.backgroundColor = "";
            }
            $(ev.currentTarget)[0].checked = true;
            // $(ev.currentTarget)[0].style.backgroundColor = "#191813";
        });

        html.find('.check-button').click(ev => {
            var i;
            for (i = 0; i <= 5; i++) {
                if (html.find('.skill-roll-selector')[i].checked === true) {
                    var selectedSkill = html.find('.skill-roll-selector')[i].id;
                    var selectedSkill = selectedSkill.slice(0, -9)
                    var selectedSkillValue = document.getElementById(selectedSkill).value;
                }
            }
            for (i = 0; i <= 5; i++) {
                if (html.find('.style-roll-selector')[i].checked === true) {
                    var selectedStyle = html.find('.style-roll-selector')[i].id;
                    var selectedStyle = selectedStyle.slice(0, -9)
                    var selectedStyleValue = document.getElementById(selectedStyle).value;
                }
            }
            var checkTarget = parseInt(selectedSkillValue) + parseInt(selectedStyleValue);
            this.rollSkillTest(event, checkTarget, selectedSkill, selectedStyle);
        });



        function barRenderer() {
            var i;
            var voidpointsmax = document.getElementById('max-void').value;
            for (i = 0; i < 6; i++) {
                if (i + 1 <= document.getElementById('total-mom').value) {
                    html.find('[id^="mom"]')[i].setAttribute("data-value", "1");
                    html.find('[id^="mom"]')[i].style.backgroundColor = "#191813";
                    html.find('[id^="mom"]')[i].style.color = "#ffffff";
                } else {
                    html.find('[id^="mom"]')[i].setAttribute("data-value", "0");
                    html.find('[id^="mom"]')[i].style.backgroundColor = "";
                    html.find('[id^="mom"]')[i].style.color = "";
                }
            }
            for (i = 0; i < 12; i++) {
                if (i + 1 <= document.getElementById('total-stress').value) {
                    html.find('[id^="stress"]')[i].setAttribute("data-value", "1");
                    html.find('[id^="stress"]')[i].style.backgroundColor = "#191813";
                    html.find('[id^="stress"]')[i].style.color = "#ffffff";
                } else {
                    html.find('[id^="stress"]')[i].setAttribute("data-value", "0");
                    html.find('[id^="stress"]')[i].style.backgroundColor = "";
                    html.find('[id^="stress"]')[i].style.color = "";
                }
            }
            for (i = 0; i < voidpointsmax; i++) {
                if (i + 1 <= document.getElementById('total-void').value) {
                    html.find('[id^="void"]')[i].setAttribute("data-value", "1");
                    html.find('[id^="void"]')[i].style.backgroundColor = "#191813";
                    html.find('[id^="void"]')[i].style.color = "#ffffff";
                } else {
                    html.find('[id^="void"]')[i].setAttribute("data-value", "0");
                    html.find('[id^="void"]')[i].style.backgroundColor = "";
                    html.find('[id^="void"]')[i].style.color = "";
                }
            }

        }

        barRenderer();

    }

    async updateVoidPoint(val) {
        let updated = await DishonoredCharacter._changeVoidPoint();
    }

    async rollSkillTest(event, checkTarget, selectedSkill, selectedStyle) {
        event.preventDefault();
        let rolldialog = await DishonoredRollDialog.create();
        if (rolldialog) {
            let dicePool = rolldialog.get("dicePoolSlider");
            let focusTarget = parseInt(rolldialog.get("dicePoolFocus"));
            let dishonoredRoll = new DishonoredRoll();
            dishonoredRoll.perform(dicePool, checkTarget, focusTarget, selectedSkill, selectedStyle);
        }
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
}