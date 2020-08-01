import {
    DishonoredSharedActorFunctions
} from '../actor.js'

export class DishonoredNPCSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["dishonored", "sheet", "npc"],
            template: "systems/FVTT-Dishonored/templates/actors/npc-sheet.html",
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

        //Ensure skill and style values don't weigh over the max of 8.
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

        // Checks if stress is larger than its max, if so, set to max. 
        if (data.data.stress.value > data.data.stress.max) data.data.stress.value = data.data.stress.max;

        //Ensure skill and style values aren't lower than 4.
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

        // Checks if stress is below 0, if so - set it to 0.
        if (data.data.stress.value < 0) data.data.stress.value = 0;
        
        return data;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        
        // Opens the class DishonoredSharedActorFunctions for access at various stages.
        let dishonoredActor = new DishonoredSharedActorFunctions()

        // We use i alot in for loops. Best to assign it now for use later in multiple places.
        var i;

        // This creates a dynamic Stress tracker. It polls for the value of the survive skill, adds any protection from armor. 
        // With the total value, creates a new div for each and places it under a child called "bar-stress-renderer".
        var stressTrackMax = parseInt(html.find('#survive')[0].value);
        var armor = html.find('[id^="protectval-armor"]');
        for (i = 0; i < armor.length; i++) {
            stressTrackMax += parseInt(armor[i].innerHTML);
        }
        if (html.find('#max-stress')[0].value != stressTrackMax)
        {
            html.find('#max-stress')[0].value = stressTrackMax;
            this.submit();
        }
        for (i = 1; i <= stressTrackMax; i++) {
            var div = document.createElement("DIV");
            div.className = "stressbox";
            div.id = "stress-" + i;
            div.innerHTML = i;
            div.style = "width: calc(100% / " + html.find('#max-stress')[0].value + ");"
            html.find('#bar-stress-renderer')[0].appendChild(div);
        }

        // Fires the function dishonoredRenderTracks as soon as the parameters exist to do so.
        dishonoredActor.dishonoredRenderTracks(html, stressTrackMax);

        // This allows for each item-edit image to link open an item sheet. This uses Simple Worldbuilding System Code.
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.getOwnedItem(li.data("itemId"));
            item.sheet.render(true);
        });

        // This if statement checks if the form is editable, if not it hides controls used by the owner, then aborts any more of the script.
        if (!this.options.editable) {
            // This hides the ability to Perform a Skill Test for the character
            for (i = 0; i < html.find('.check-button').length; i++) {
                html.find('.check-button')[i].style.display = 'none';
            }
            // This hides all add item images
            for (i = 0; i < html.find('.add-item').length; i++) {
                html.find('.add-item')[i].style.display = 'none';
            }
            // This hides all remove item images
            for (i = 0; i < html.find('.item-delete').length; i++) {
                html.find('.item-delete')[i].style.display = 'none';
            }
            // This hides all skill and style check boxes (and titles)
            for (i = 0; i < html.find('.stat-selector-text').length; i++) {
                html.find('.stat-selector-text')[i].style.display = 'none';
            }
            for (i = 0; i < html.find('.style-roll-selector').length; i++) {
                html.find('.style-roll-selector')[i].style.display = 'none';
            }
            for (i = 0; i < html.find('.skill-roll-selector').length; i++) {
                html.find('.skill-roll-selector')[i].style.display = 'none';
            }
            // Remove hover CSS from clickables that are no longer clickable.
            for (i = 0; i < html.find('.stressbox').length; i++) {
                html.find('.stressbox')[i].classList.add("unset-clickables");
            }
            for (i = 0; i < html.find('.cs-item-img').length; i++) {
                html.find('.cs-item-img')[i].classList.add("unset-clickables");
            }
            for (i = 0; i < html.find('.item-create').length; i++) {
                html.find('.item-create')[i].classList.add("unset-clickables");
            }
            return;
        };

        // This allows for all items to be rolled, it gets the current targets type and id and sends it to the rollGenericItem function.
        html.find('.cs-item-img').click(ev =>{
            var itemType = $(ev.currentTarget).parents(".item")[0].getAttribute("data-item-type");
            var itemId = $(ev.currentTarget).parents(".item")[0].getAttribute("data-item-id");
            dishonoredActor.rollGenericItem(event, itemType, itemId, this.actor);
        })

        // Allows item-create images to create an item of a type defined individually by each button. This uses code found via the Foundry VTT System Tutorial.
        html.find('.item-create').click(ev => {
            event.preventDefault();
            const header = event.currentTarget;
            const type = header.dataset.type;
            const data = duplicate(header.dataset);
            const name = `New ${type.capitalize()}`;
            const itemData = {
                name: name,
                type: type,
                data: data
            };
            delete itemData.data["type"];
            return this.actor.createOwnedItem(itemData);
        });

        // Allows item-delete images to allow deletion of the selected item. This uses Simple Worldbuilding System Code.
        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            this.actor.deleteOwnedItem(li.data("itemId"));
            li.slideUp(200, () => this.render(false));
        });

        // Reads if a stress track box has been clicked, and if it has will either: set the value to the clicked box, or reduce the value by one.
        // This check is dependent on various requirements, see comments in code.
        html.find('[id^="stress"]').click(ev => {
            var newTotalObject = $(ev.currentTarget)[0];
            var newTotal = newTotalObject.id.substring(7);
            // data-selected stores whether the track box is currently activated or not. This checks that the box is activated
            if (newTotalObject.getAttribute("data-selected") === "true") {
                // Now we check that the "next" track box is not activated. 
                // If there isn't one, or it isn't activated, we only want to decrease the value by 1 rather than setting the value.
                var nextCheck = 'stress-' + (parseInt(newTotal) + 1);
                console.log(html.find('#'+nextCheck)[0]);
                if (!html.find('#'+nextCheck)[0] || html.find('#'+nextCheck)[0].getAttribute("data-selected") != "true") {
                    html.find('#total-stress')[0].value = html.find('#total-stress')[0].value - 1;
                    this.submit();
                } 
                // If it isn't caught by the if, the next box is likely activated. If something happened, its safer to set the value anyway.
                else {
                    var total = html.find('#total-stress')[0].value;
                    if (total != newTotal) {
                        html.find('#total-stress')[0].value = newTotal;
                        this.submit();
                    }
                }
            } 
            // If the clicked box wasn't activated, we need to activate it now.
            else {
                var total = html.find('#total-stress')[0].value;
                if (total != newTotal) {
                    html.find('#total-stress')[0].value = newTotal;
                    this.submit();
                }
            }
        });

        // Turns the Skill checkboxes into essentially a radio button. It removes any other ticks, and then checks the new skill.
        // Finally a submit is required as data has changed.
        html.find('.skill-roll-selector').click(ev => {
            for (i = 0; i <= 5; i++) {
                html.find('.skill-roll-selector')[i].checked = false;
            }
            $(ev.currentTarget)[0].checked = true;
        });

        // Turns the Style checkboxes into essentially a radio button. It removes any other ticks, and then checks the new style.
        // Finally a submit is required as data has changed.
        html.find('.style-roll-selector').click(ev => {
            for (i = 0; i <= 5; i++) {
                html.find('.style-roll-selector')[i].checked = false;
            }
            $(ev.currentTarget)[0].checked = true;
        });

        // If the check-button is clicked it grabs the selected skill and the selected style and fires the method rollSkillTest. See actor.js for further info.
        html.find('.check-button').click(ev => {
            for (i = 0; i <= 5; i++) {
                if (html.find('.skill-roll-selector')[i].checked === true) {
                    var selectedSkill = html.find('.skill-roll-selector')[i].id;
                    var selectedSkill = selectedSkill.slice(0, -9)
                    var selectedSkillValue = html.find('#'+selectedSkill)[0].value;
                }
            }
            for (i = 0; i <= 5; i++) {
                if (html.find('.style-roll-selector')[i].checked === true) {
                    var selectedStyle = html.find('.style-roll-selector')[i].id;
                    var selectedStyle = selectedStyle.slice(0, -9)
                    var selectedStyleValue = html.find('#'+selectedStyle)[0].value;
                }
            }
            var checkTarget = parseInt(selectedSkillValue) + parseInt(selectedStyleValue);
            dishonoredActor.rollSkillTest(event, checkTarget, selectedSkill, selectedStyle, this.actor);
        });
    }
}