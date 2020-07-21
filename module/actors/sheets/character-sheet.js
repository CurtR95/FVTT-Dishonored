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
export class DishonoredCharacterSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["dishonored", "sheet", "character"],
            template: "systems/FVTT-Dishonored/templates/actors/character-sheet.html",
            width: 700,
            height: 735,
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
        if (data.data.stress.value > data.data.stress.max) data.data.stress.value = data.data.stress.max;


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
        if (data.data.stress.value < 0) data.data.stress.value = 0;

        return data;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        var appId = this.appId;

        var voidPointsMax = $("[data-appid="+appId+"]").find('#max-void')[0].value;
        var i;
        for (i = 1; i <= voidPointsMax; i++) {
            var div = document.createElement("DIV");
            div.className = "voidbox";
            div.id = "void-" + i;
            div.innerHTML = i;
            div.style = "width: calc(100% / " + $("[data-appid="+appId+"]").find('#max-void')[0].value + ");"
            $("[data-appid="+appId+"]").find('#bar-void-renderer')[0].appendChild(div);
            //   <div class="voidbox" id="void-1">1</div>
        }

        
        var stressTrackMax = parseInt($("[data-appid="+appId+"]").find('#survive')[0].value);
        var armor = html.find('[id^="protectval-armor"]');
        for (i = 0; i < armor.length; i++) {
            stressTrackMax += parseInt(armor[i].innerHTML);
        }
        if ($("[data-appid="+appId+"]").find('#max-stress')[0].value != stressTrackMax)
        {
            $("[data-appid="+appId+"]").find('#max-stress')[0].value = stressTrackMax;
            this.submit();
        }
        for (i = 1; i <= stressTrackMax; i++) {
            var div = document.createElement("DIV");
            div.className = "stressbox";
            div.id = "stress-" + i;
            div.innerHTML = i;
            div.style = "width: calc(100% / " + $("[data-appid="+appId+"]").find('#max-stress')[0].value + ");"
            $("[data-appid="+appId+"]").find('#bar-stress-renderer')[0].appendChild(div);
            //   <div class="stressbox" id="stress-1">1</div>
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
                    $("[data-appid="+appId+"]").find('#total-mom')[0].value = $("[data-appid="+appId+"]").find('#total-mom')[0].value - 1;
                    barRenderer();
                } else {
                    var total = $("[data-appid="+appId+"]").find('#total-mom')[0].value;
                    if (total != newTotal) {
                        $("[data-appid="+appId+"]").find('#total-mom')[0].value = newTotal;
                        barRenderer();
                    }
                }
            } else {
                var total = $("[data-appid="+appId+"]").find('#total-mom')[0].value;
                if (total != newTotal) {
                    $("[data-appid="+appId+"]").find('#total-mom')[0].value = newTotal;
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
                    $("[data-appid="+appId+"]").find('#total-stress')[0].value = $("[data-appid="+appId+"]").find('#total-stress')[0].value - 1;
                    barRenderer();
                    this.submit();
                } else {
                    var total = $("[data-appid="+appId+"]").find('#total-stress')[0].value;
                    if (total != newTotal) {
                        $("[data-appid="+appId+"]").find('#total-stress')[0].value = newTotal;
                        barRenderer();
                        this.submit();
                    }
                }
            } else {
                var total = $("[data-appid="+appId+"]").find('#total-stress')[0].value;
                if (total != newTotal) {
                    $("[data-appid="+appId+"]").find('#total-stress')[0].value = newTotal;
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
                    $("[data-appid="+appId+"]").find('#total-void')[0].value = $("[data-appid="+appId+"]").find('#total-void')[0].value - 1;
                    barRenderer();
                    this.submit();
                } else {
                    var total = $("[data-appid="+appId+"]").find('#total-void')[0].value;
                    if (total != newTotal) {
                        $("[data-appid="+appId+"]").find('#total-void')[0].value = newTotal;
                        barRenderer();
                        this.submit();
                    }
                }
            } else {
                var total = $("[data-appid="+appId+"]").find('#total-void')[0].value;
                if (total != newTotal) {
                    $("[data-appid="+appId+"]").find('#total-void')[0].value = newTotal;
                    barRenderer();
                    this.submit();
                }
            }
        });

        html.find('[id="decrease-void-max"]').click(ev => {
            $("[data-appid="+appId+"]").find('#max-void')[0].value--;
            this.submit();
        });

        html.find('[id="increase-void-max"]').click(ev => {
            $("[data-appid="+appId+"]").find('#max-void')[0].value++;
            this.submit();
        });

        html.find('.skill-roll-selector').click(ev => {
            var i;
            for (i = 0; i <= 5; i++) {
                html.find('.skill-roll-selector')[i].checked = false;
            }
            $(ev.currentTarget)[0].checked = true;
        });

        html.find('.style-roll-selector').click(ev => {
            var i;
            for (i = 0; i <= 5; i++) {
                html.find('.style-roll-selector')[i].checked = false;
            }
            $(ev.currentTarget)[0].checked = true;
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
            var voidPointsMax = $("[data-appid="+appId+"]").find('#max-void')[0].value;
            var stressTrackMax = parseInt($("[data-appid="+appId+"]").find('#survive')[0].value);
            var armor = html.find('[id^="protectval-armor"]');
            for (i = 0; i < armor.length; i++) {
                stressTrackMax += parseInt(armor[i].innerHTML);
            }
            for (i = 0; i < 6; i++) {
                if (i + 1 <= $("[data-appid="+appId+"]").find('#total-mom')[0].value) {
                    html.find('[id^="mom"]')[i].setAttribute("data-value", "1");
                    html.find('[id^="mom"]')[i].style.backgroundColor = "#191813";
                    html.find('[id^="mom"]')[i].style.color = "#ffffff";
                } else {
                    html.find('[id^="mom"]')[i].setAttribute("data-value", "0");
                    html.find('[id^="mom"]')[i].style.backgroundColor = "rgb(255, 255, 255, 0.3)";
                    html.find('[id^="mom"]')[i].style.color = "";
                }
            }
            for (i = 0; i < stressTrackMax; i++) {
                if (i + 1 <= $("[data-appid="+appId+"]").find('#total-stress')[0].value) {
                    html.find('[id^="stress"]')[i].setAttribute("data-value", "1");
                    html.find('[id^="stress"]')[i].style.backgroundColor = "#191813";
                    html.find('[id^="stress"]')[i].style.color = "#ffffff";
                } else {
                    html.find('[id^="stress"]')[i].setAttribute("data-value", "0");
                    html.find('[id^="stress"]')[i].style.backgroundColor = "rgb(255, 255, 255, 0.3)";
                    html.find('[id^="stress"]')[i].style.color = "";
                }
            }
            for (i = 0; i < voidPointsMax; i++) {
                if (i + 1 <= $("[data-appid="+appId+"]").find('#total-void')[0].value) {
                    html.find('[id^="void"]')[i].setAttribute("data-value", "1");
                    html.find('[id^="void"]')[i].style.backgroundColor = "#191813";
                    html.find('[id^="void"]')[i].style.color = "#ffffff";
                } else {
                    html.find('[id^="void"]')[i].setAttribute("data-value", "0");
                    html.find('[id^="void"]')[i].style.backgroundColor = "rgb(255, 255, 255, 0.3)";
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