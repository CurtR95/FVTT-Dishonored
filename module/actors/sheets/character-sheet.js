import {
    DishonoredSharedActorFunctions
} from '../actor.js'

export class DishonoredCharacterSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["dishonored", "sheet", "actor", "character"],
            width: 700,
            height: 735,
            dragDrop: [{
                dragSelector: ".item-list .item",
                dropSelector: null
            }]
        });
    }

    /* -------------------------------------------- */

    // If the player is not a GM and has limited permissions - send them to the limited sheet, otherwise, continue as usual.
    /** @override */
    get template() {
        if ( !game.user.isGM && this.actor.limited) return "systems/FVTT-Dishonored/templates/actors/limited-sheet.html";
        return `systems/FVTT-Dishonored/templates/actors/character-sheet.html`;
      }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        const data = super.getData();

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

        // Checks if any values are larger than their relevant max, if so, set to max. 
        if (data.data.void.value > data.data.void.max) data.data.void.value = data.data.void.max;
        if (data.data.stress.value > data.data.stress.max) data.data.stress.value = data.data.stress.max;
        // For some reason - this is treated as a string, so this enforce use of integers here.
        if (parseInt(data.data.mana.value) > parseInt(data.data.mana.max)) data.data.mana.value = data.data.mana.max;

        // Checks if mana max is not equal to double the void max, if it isn't, set it so.
        if (data.data.mana.max != 2*data.data.void.max) data.data.mana.max = 2*data.data.void.max;

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

        // Checks if any values are below their theoretical minimum, if so - set it to the very minimum.
        if (data.data.void.value < 0) data.data.void.value = 0;
        if (data.data.void.max < 1) data.data.void.max = 1;
        if (data.data.stress.value < 0) data.data.stress.value = 0;
        if (data.data.experience < 0) data.data.experience = 0;
        if (data.data.mana.value < 0) data.data.mana.value = 0;
        if (data.data.mana.max < 2) data.data.mana.max = 2;
        
        return data;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        
        // Opens the class DishonoredSharedActorFunctions for access at various stages.
        let dishonoredActor = new DishonoredSharedActorFunctions();

        // If the player has limited access to the actor, there is nothing to see here. Return.
        if ( !game.user.isGM && this.actor.limited) return;

        // We use i alot in for loops. Best to assign it now for use later in multiple places.
        var i;

        // Here we are checking how many bonecharms, helmets and armors are equipped. 
        // The player can only have three bonecharms, and one of each armor type. As such, we will use this later.
        var bonecharmCount = 0;
        var armorCount = 0;
        var helmetCount = 0;
        this.actor.items.forEach((values) => {
            if (values.type == "bonecharm") bonecharmCount+= 1;
        });
        html.find('[name ="data.bonecharmequipped"]')[0].value = bonecharmCount;
        // For ease of access we may as well turn the tooltip for bonecharm counts red.
        if(bonecharmCount > 3) {
            html.find('.bonecharmCount')[0].style.backgroundColor = "#fd0000";
            html.find('.bonecharmCount')[0].style.color = "#ffffff";
        }

        // This creates a dynamic Void Point tracker. It polls for the hidden control "max-void" and for the value, 
        // creates a new div for each and places it under a child called "bar-void-renderer"
        var voidPointsMax = html.find('#max-void')[0].value;
        for (i = 1; i <= voidPointsMax; i++) {
            var div = document.createElement("DIV");
            div.className = "box";
            div.id = "void-" + i;
            div.innerHTML = i;
            div.style = "width: calc(100% / " + html.find('#max-void')[0].value + ");"
            html.find('#bar-void-renderer')[0].appendChild(div);
        }

        // This creates a dynamic Stress tracker. It polls for the value of the survive skill, adds any protection from armor. 
        // With the total value, creates a new div for each and places it under a child called "bar-stress-renderer".
        var stressTrackMax = parseInt(html.find('#survive')[0].value);
        var armor = html.find('[id^="protectval-armor"]');
        for (i = 0; i < armor.length; i++) {
            stressTrackMax += parseInt(armor[i].innerHTML);
        }
        // This checks that the max-stress hidden field is equal to the calculated Max Stress value, if not it makes it so.
        if (html.find('#max-stress')[0].value != stressTrackMax)
        {
            html.find('#max-stress')[0].value = stressTrackMax;
        }
        for (i = 1; i <= stressTrackMax; i++) {
            var div = document.createElement("DIV");
            div.className = "box";
            div.id = "stress-" + i;
            div.innerHTML = i;
            div.style = "width: calc(100% / " + html.find('#max-stress')[0].value + ");"
            html.find('#bar-stress-renderer')[0].appendChild(div);
        }

        // This creates a dynamic Experience tracker. For this it uses a max value of 30. This can be configured here. 
        // It creates a new div for each and places it under a child called "bar-void-renderer"
        var expPointsMax = game.settings.get("FVTT-Dishonored", "maxNumberOfExperience");
        var i;
        for (i = 1; i <= expPointsMax; i++) {
            var div = document.createElement("DIV");
            div.className = "box";
            div.id = "exp-" + i;
            div.innerHTML = i;
            div.style = "width: calc(100% / " + expPointsMax + ");"
            html.find('#bar-exp-renderer')[0].appendChild(div);
        }

        // This creates a dynamic Momentum tracker. Dishonored only has 6 momentum, so this should never be changed. But this can be configured here. 
        // It creates a new div for each and places it under a child called "bar-mom-renderer"
        var momPointsMax = 6;
        var i;
        for (i = 1; i <= momPointsMax; i++) {
            var div = document.createElement("DIV");
            div.className = "box";
            div.id = "mom-" + i;
            div.innerHTML = i;
            div.style = "width: calc(100% / " + momPointsMax + ");"
            html.find('#bar-mom-renderer')[0].appendChild(div);
        }

        // Fires the function dishonoredRenderTracks as soon as the parameters exist to do so.
        dishonoredActor.dishonoredRenderTracks(html, stressTrackMax, voidPointsMax, expPointsMax, momPointsMax);

        // This allows for each item-edit image to link open an item sheet. This uses Simple Worldbuilding System Code.
        html.find('.control.edit').click(ev => {
            const li = $(ev.currentTarget).parents(".entry");
            const item = this.actor.getOwnedItem(li.data("itemId"));
            item.sheet.render(true);
        });

        // This if statement checks if the form is editable, if not it hides control used by the owner, then aborts any more of the script.
        if (!this.options.editable) {
            // This hides the ability to Perform a Skill Test for the character.
            for (i = 0; i < html.find('.check-button').length; i++) {
                html.find('.check-button')[i].style.display = 'none';
            }
            // This hides the ability to change the amount of Void Points the character has.
            for (i = 0; i < html.find('.voidchange').length; i++) {
                html.find('.voidchange')[i].style.display = 'none';
            }
            // This hides all add and delete item images.
            for (i = 0; i < html.find('.control.create').length; i++) {
                html.find('.control.create')[i].style.display = 'none';
            }
            for (i = 0; i < html.find('.control.delete').length; i++) {
                html.find('.control.delete')[i].style.display = 'none';
            }
            // This hides all skill and style check boxes (and titles)
            for (i = 0; i < html.find('.selector').length; i++) {
                html.find('.selector')[i].style.display = 'none';
            }
            for (i = 0; i < html.find('.selector').length; i++) {
                html.find('.selector')[i].style.display = 'none';
            }
            // Remove hover CSS from clickables that are no longer clickable.
            for (i = 0; i < html.find('.box').length; i++) {
                html.find('.box')[i].classList.add("unset-clickables");
            }
            for (i = 0; i < html.find('.rollable').length; i++) {
                html.find('.rollable')[i].classList.add("unset-clickables");
            }

            return;
        };

        // This allows for all items to be rolled, it gets the current targets type and id and sends it to the rollGenericItem function.
        html.find('.rollable').click(ev =>{
            var itemType = $(ev.currentTarget).parents(".entry")[0].getAttribute("data-item-type");
            var itemId = $(ev.currentTarget).parents(".entry")[0].getAttribute("data-item-id");
            dishonoredActor.rollGenericItem(event, itemType, itemId, this.actor);
        })

        // Allows item-create images to create an item of a type defined individually by each button. This uses code found via the Foundry VTT System Tutorial.
        html.find('.control.create').click(ev => {
            event.preventDefault();
            const header = event.currentTarget;
            const type = header.dataset.type;
            if (type == "bonecharm" && bonecharmCount >= 3) ui.notifications.warn("The current actor has 3 equipped bonecharms already.");
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
        html.find('.control.delete').click(ev => {
            const li = $(ev.currentTarget).parents(".entry");
            this.actor.deleteOwnedItem(li.data("itemId"));
            li.slideUp(200, () => this.render(false));
        });

        // Reads if a experience track box has been clicked, and if it has will either: set the value to the clicked box, or reduce the value by one. 
        // This check is dependent on various requirements, see comments in code.
        html.find('[id^="exp"]').click(ev => {
            var newTotalObject = $(ev.currentTarget)[0];
            var newTotal = newTotalObject.id.replace(/\D/g, '');
            // data-selected stores whether the track box is currently activated or not. This checks that the box is activated
            if (newTotalObject.getAttribute("data-selected") === "true") {
                // Now we check that the "next" track box is not activated. 
                // If there isn't one, or it isn't activated, we only want to decrease the value by 1 rather than setting the value.
                var nextCheck = 'exp-' + (parseInt(newTotal) + 1);
                if (!html.find('#'+nextCheck)[0] || html.find('#'+nextCheck)[0].getAttribute("data-selected") != "true") {
                    html.find('#total-exp')[0].value = html.find('#total-exp')[0].value - 1;
                    this.submit();
                } 
                // If it isn't caught by the if, the next box is likely activated. If something happened, its safer to set the value anyway.
                else {
                    var total = html.find('#total-exp')[0].value;
                    if (total != newTotal) {
                        html.find('#total-exp')[0].value = newTotal;
                        this.submit();
                    }
                }
            } 
            // If the clicked box wasn't activated, we need to activate it now.
            else {
                var total = html.find('#total-exp')[0].value;
                if (total != newTotal) {
                    html.find('#total-exp')[0].value = newTotal;
                    this.submit();
                }
            }
        });

        // Reads if a momentum track box has been clicked, and if it has will either: set the value to the clicked box, or reduce the value by one.
        // See line 186-220 for a more detailed break down on the context of each scenario. Momentum uses the same logic.
        html.find('[id^="mom"]').click(ev => {
            var newTotalObject = $(ev.currentTarget)[0];
            var newTotal = newTotalObject.id.substring(4);
            if (newTotalObject.getAttribute("data-selected") === "true") {
                var nextCheck = 'mom-' + (parseInt(newTotal) + 1);
                if (!html.find('#'+nextCheck)[0] || html.find('#'+nextCheck)[0].getAttribute("data-selected") != "true") {
                    html.find('#total-mom')[0].value = html.find('#total-mom')[0].value - 1;
                    this.submit();
                } else {
                    var total = html.find('#total-mom')[0].value;
                    if (total != newTotal) {
                        html.find('#total-mom')[0].value = newTotal;
                        this.submit();
                    }
                }
            } else {
                var total = html.find('#total-mom')[0].value;
                if (total != newTotal) {
                    html.find('#total-mom')[0].value = newTotal;
                    this.submit();
                }
            }
        });

        // Reads if a stress track box has been clicked, and if it has will either: set the value to the clicked box, or reduce the value by one.
        // See line 186-220 for a more detailed break down on the context of each scenario. Stress uses the same logic.
        html.find('[id^="stress"]').click(ev => {
            var newTotalObject = $(ev.currentTarget)[0];
            var newTotal = newTotalObject.id.substring(7);
            if (newTotalObject.getAttribute("data-selected") === "true") {
                var nextCheck = 'stress-' + (parseInt(newTotal) + 1);
                console.log(html.find('#'+nextCheck)[0]);
                if (!html.find('#'+nextCheck)[0] || html.find('#'+nextCheck)[0].getAttribute("data-selected") != "true") {
                    html.find('#total-stress')[0].value = html.find('#total-stress')[0].value - 1;
                    this.submit();
                } else {
                    var total = html.find('#total-stress')[0].value;
                    if (total != newTotal) {
                        html.find('#total-stress')[0].value = newTotal;
                        this.submit();
                    }
                }
            } else {
                var total = html.find('#total-stress')[0].value;
                if (total != newTotal) {
                    html.find('#total-stress')[0].value = newTotal;
                    this.submit();
                }
            }
        });

        // Reads if a void track box has been clicked, and if it has will either: set the value to the clicked box, or reduce the value by one.
        // See line 186-220 for a more detailed break down on the context of each scenario. Void uses the same logic.
        html.find('[id^="void"]').click(ev => {
            var newTotalObject = $(ev.currentTarget)[0];
            var newTotal = newTotalObject.id.replace(/\D/g, '');
            if (newTotalObject.getAttribute("data-selected") === "true") {
                var nextCheck = 'void-' + (parseInt(newTotal) + 1);
                if (!html.find('#'+nextCheck)[0] || html.find('#'+nextCheck)[0].getAttribute("data-selected") != "true") {
                    html.find('#total-void')[0].value = html.find('#total-void')[0].value - 1;
                    this.submit();
                } else {
                    var total = html.find('#total-void')[0].value;
                    if (total != newTotal) {
                        html.find('#total-void')[0].value = newTotal;
                        this.submit();
                    }
                }
            } else {
                var total = html.find('#total-void')[0].value;
                if (total != newTotal) {
                    html.find('#total-void')[0].value = newTotal;
                    this.submit();
                }
            }
        });
        
        // If the decrease-void-max button is clicked it removes a point off the max-void and two points from max-mana.
        html.find('[id="decrease-void-max"]').click(ev => {
            html.find('#max-void')[0].value--;
            html.find('#max-mana')[0].value--;
            html.find('#max-mana')[0].value--;
            this.submit();
        });

        // If the increase-void-max button is clicked it adds a point to the max-void and two points to max-mana.
        html.find('[id="increase-void-max"]').click(ev => {
            html.find('#max-void')[0].value++;
            html.find('#max-mana')[0].value++;
            html.find('#max-mana')[0].value++;
            this.submit();
        });

        // Turns the Skill checkboxes into essentially a radio button. It removes any other ticks, and then checks the new skill.
        // Finally a submit is required as data has changed.
        html.find('.selector.skill').click(ev => {
            for (i = 0; i <= 5; i++) {
                html.find('.selector.skill')[i].checked = false;
            }
            $(ev.currentTarget)[0].checked = true;
            this.submit();
        });

        // Turns the Style checkboxes into essentially a radio button. It removes any other ticks, and then checks the new style.
        // Finally a submit is required as data has changed.
        html.find('.selector.style').click(ev => {
            for (i = 0; i <= 5; i++) {
                html.find('.selector.style')[i].checked = false;
            }
            $(ev.currentTarget)[0].checked = true;
            this.submit();
        });

        // If the check-button is clicked it grabs the selected skill and the selected style and fires the method rollSkillTest. See actor.js for further info.
        html.find('.check-button').click(ev => {
            for (i = 0; i <= 5; i++) {
                if (html.find('.selector.skill')[i].checked === true) {
                    var selectedSkill = html.find('.selector.skill')[i].id;
                    var selectedSkill = selectedSkill.slice(0, -9)
                    var selectedSkillValue = html.find('#'+selectedSkill)[0].value;
                }
            }
            for (i = 0; i <= 5; i++) {
                if (html.find('.selector.style')[i].checked === true) {
                    var selectedStyle = html.find('.selector.style')[i].id;
                    var selectedStyle = selectedStyle.slice(0, -9)
                    var selectedStyleValue = html.find('#'+selectedStyle)[0].value;
                }
            }
            var checkTarget = parseInt(selectedSkillValue) + parseInt(selectedStyleValue);
            dishonoredActor.rollSkillTest(event, checkTarget, selectedSkill, selectedStyle, this.actor);
        });
    }
}