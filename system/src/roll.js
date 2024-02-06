export class DishonoredRoll {

	/**
     * Perform roll and send the results to chat message.
     * @param {Number} dicePool Number of dice to roll.
     * @param {Number} checkTarget The target number to try and be lower than.
     * @param {Number} focusTarget The focus amount of the current roll.
     * @param {String} selectedSkill Name of the current skill selected.
     * @param {String} selectedStyle Name of the current style selected.
     * @param {Actor} speaker The Actor which is performing the roll.
     */
	async performSkillTest(
		dicePool, checkTarget, focusTarget, selectedSkill, selectedStyle, speaker
	) {
		// Define some variables that we will be using later.
		let r;
		let i;
		let successText;
		let complicationText;
		let result = 0;
		let diceString = "";
		let success = 0;
		let complication = 0;

		// Define r as our dice roll we want to perform (1d20, 2d20, 3d20, 4d20
		// or 5d20). We will then roll it.
		r = new Roll(`${dicePool}d20`);
		let rollPromise = r.evaluate({async: true});
		await rollPromise.then(function() {
			// Now for each dice in the dice pool we want to check what the individual result was.
			for (i = 0; i < dicePool; i++) {
				result = r.terms[0].results[i].result;
				// If the result is less than or equal to the focus, that counts
				// as 2 successes and we want to show the dice as green.
				if (result <= focusTarget) {
					diceString += `<li class="roll die d20 max">${result}</li>`;
					success += 2;
				}
				// If the result is less than or equal to the target (the style
				// and skill added together), that counts as 1 success but we
				// want to show the dice as normal.
				else if (result <= checkTarget) {
					diceString += `<li class="roll die d20">${result}</li>`;
					success += 1;
				}
				// If the result is 20, than we want to count it as a
				// complication. We also want to show it as red!
				else if (result === 20) {
					diceString += `<li class="roll die d20 min">${result}</li>`;
					complication += 1;
				}
				// If none of the above is true, the dice failed to do anything
				// and is treated as normal.
				else {
					diceString += `<li class="roll die d20">${result}</li>`;
				}
			}
		});

		// Here we want to check if the success was exactly one (as
		// "1 Successes" doesn't make grammatical sense). We create a string
		// for the Successes.
		if (success === 1) {
			successText = success + game.i18n.format("dishonored.roll.success");
		}
		else {
			successText = success + game.i18n.format("dishonored.roll.successPlural");
		}

		// Check if we allow multiple complications, or if only one complication
		// ever happens.
		const multipleComplicationsAllowed = game.settings.get("FVTT-Dishonored", "multipleComplications");

		// If there is any complications, we want to crate a string for this.
		// If we allow multiple complications and they exist, we want to
		// pluralise this also.
		// If no complications exist then we don't even show this box.
		if (complication >= 1) {
			if (complication > 1 && multipleComplicationsAllowed === true) {
				let localisedPluralisation = game.i18n.format("dishonored.roll.complicationPlural");
				complicationText = `<h4 class="dice-total failure"> ${localisedPluralisation.replace("|#|", complication)}</h4>`;
			}
			else {
				complicationText = `<h4 class="dice-total failure"> ${game.i18n.format("dishonored.roll.complication")}</h4>`;
			}
		}
		else {
			complicationText = "";
		}

		/** Set the flavour to "[Skill] [Style] Skill Test". This shows the chat
		// what type of test occurred. */
		let flavour = `${game.i18n.format(`dishonored.actor.skill.${selectedSkill}`)} ${game.i18n.format(`dishonored.actor.style.${selectedStyle}`)} ${game.i18n.format("dishonored.roll.test")}`;

		// Build a dynamic html using the variables from above.
		let html = `<div class="dishonored roll skill">
                <div class="dice-roll">
                    <div class="dice-result">
                        <div class="dice-formula">
                            <table class="aim">
                                <tr>
                                    <td> ${dicePool}d20 </td>
                                    <td> ${game.i18n.format("dishonored.roll.html.target")}:${checkTarget} </td>
                                    <td> ${game.i18n.format("dishonored.roll.html.focus")}:${focusTarget} </td>
                                </tr>
                            </table>
                        </div>
                        <div class="dice-tooltip">
                            <section class="tooltip-part">
                                <div class="dice">
                                    <ol class="dice-rolls">${diceString}</ol>
                                </div>
                            </section>
                        </div>${
	complicationText
}<h4 class="dice-total">${successText}</h4>
                    </div>
                </div>
            </div>`;
		this.sendToChat(CONST.CHAT_MESSAGE_TYPES.ROLL, speaker, html, r, flavour);
	}

	async performItemRoll(item, speaker) {
		// Create variable div and populate it with localisation to use in the HTML.
		let valueTag;
		let variablePrompt = game.i18n.format("dishonored.roll.item.quantity");
		let variable = `<div class='dice-formula'> ${variablePrompt.replace("|#|", item.system.quantity)}</div>`;
		// Create dynamic tags div and populate it with localisation to use in the HTML.
		if (item.system.cost > 0) {
			let costLocalisation = game.i18n.format("dishonored.roll.item.value");
			valueTag = `<div class='tag'> ${costLocalisation.replace("|#|", item.system.cost)}</div>`;
		}
		else {
			valueTag = "";
		}
		// Send the div to populate a HTML template and sends to chat.
		this.genericItemTemplate(
			item.img, item.name, item.system.description, variable, valueTag
		).then(
			html => this.sendToChat(CONST.CHAT_MESSAGE_TYPES.OTHER, speaker, html)
		);
	}

	async performFocusRoll(item, speaker) {
		// Create variable div and populate it with localisation to use in the HTML.
		let variablePrompt = game.i18n.format("dishonored.roll.focus.rating");
		let variable = `<div class='dice-formula'> ${variablePrompt.replace("|#|", item.system.rating)}</div>`;
		// Send the div to populate a HTML template and sends to chat.
		this.genericItemTemplate(
			item.img, item.name, item.system.description, variable
		).then(
			html => this.sendToChat(CONST.CHAT_MESSAGE_TYPES.OTHER, speaker, html)
		);
	}

	async performBonecharmRoll(item, speaker) {
		// Populate a HTML template and sends to chat.
		this.genericItemTemplate(
			item.img, item.name, item.system.description
		).then(
			html => this.sendToChat(CONST.CHAT_MESSAGE_TYPES.OTHER, speaker, html)
		);
	}

	async performTruthRoll(item, speaker) {
		// Populate a HTML template and sends to chat.
		this.genericItemTemplate(
			item.img, item.name, item.system.description
		).then(
			html => this.sendToChat(CONST.CHAT_MESSAGE_TYPES.OTHER, speaker, html)
		);
	}

	async performWeaponRoll(item, speaker) {
		// Create variable div and populate it with localisation to use in the HTML.
		let tags;
		let variablePrompt = game.i18n.format("dishonored.roll.weapon.damage");
		let variable = `<div class='dice-formula'> ${variablePrompt.replace("|#|", item.system.damage)}</div>`;
		// Create dynamic tags div and populate it with localisation to use in the HTML.
		if (item.system.cost > 0) {
			let costLocalisation = game.i18n.format("dishonored.roll.item.value");
			tags = `<div class='tag'> ${costLocalisation.replace("|#|", item.system.cost)}</div>`;
		}
		else {
			tags = "";
		}
		if (item.system.qualities.armorpierce) tags += `<div class='tag'> ${game.i18n.format("dishonored.actor.belonging.weapon.armorpierce")}</div>`;
		if (item.system.qualities.awkward) tags += `<div class='tag'> ${game.i18n.format("dishonored.actor.belonging.weapon.awkward")}</div>`;
		if (item.system.qualities.blast) tags += `<div class='tag'> ${game.i18n.format("dishonored.actor.belonging.weapon.blast")}</div>`;
		if (item.system.qualities.block) tags += `<div class='tag'> ${game.i18n.format("dishonored.actor.belonging.weapon.block")}</div>`;
		if (item.system.qualities.burn) tags += `<div class='tag'> ${game.i18n.format("dishonored.actor.belonging.weapon.burn")}</div>`;
		if (item.system.qualities.concealed) tags += `<div class='tag'> ${game.i18n.format("dishonored.actor.belonging.weapon.concealed")}</div>`;
		if (item.system.qualities.melee) tags += `<div class='tag'> ${game.i18n.format("dishonored.actor.belonging.weapon.melee")}</div>`;
		if (item.system.qualities.messy) tags += `<div class='tag'> ${game.i18n.format("dishonored.actor.belonging.weapon.messy")}</div>`;
		if (item.system.qualities.mine) tags += `<div class='tag'> ${game.i18n.format("dishonored.actor.belonging.weapon.mine")}</div>`;
		if (item.system.qualities.rangeddistant) tags += `<div class='tag'> ${game.i18n.format("dishonored.actor.belonging.weapon.distant")}</div>`;
		if (item.system.qualities.rangednearby) tags += `<div class='tag'> ${game.i18n.format("dishonored.actor.belonging.weapon.nearby")}</div>`;
		// Send the div to populate a HTML template and sends to chat.
		this.genericItemTemplate(
			item.img, item.name, item.system.description, variable, tags
		).then(
			html => this.sendToChat(CONST.CHAT_MESSAGE_TYPES.OTHER, speaker, html)
		);
	}

	async performArmorRoll(item, speaker) {
		// Create variable div and populate it with localisation to use in the HTML.
		let valueTag;
		let variablePrompt = game.i18n.format("dishonored.roll.armor.protect");
		let variable = `<div class='dice-formula'> ${variablePrompt.replace("|#|", item.system.protection)}</div>`;
		// Create dynamic tags div and populate it with localisation to use in the HTML.
		if (item.system.cost > 0) {
			let costLocalisation = game.i18n.format("dishonored.roll.item.value");
			valueTag = `<div class='tag'> ${costLocalisation.replace("|#|", item.system.cost)}</div>`;
		}
		else {
			valueTag = "";
		}
		// Send the div to populate a HTML template and sends to chat.
		this.genericItemTemplate(
			item.img, item.name, item.system.description, variable, valueTag
		).then(
			html => this.sendToChat(CONST.CHAT_MESSAGE_TYPES.OTHER, speaker, html)
		);
	}

	async performTalentRoll(item, speaker) {
		// Create variable div and populate it with localisation to use in the HTML.
		let variablePrompt = game.i18n.format("dishonored.roll.talent.type");
		let variable = `<div class='dice-formula'> ${variablePrompt.replace("|#|", item.system.type)}</div>`;
		// Send the div to populate a HTML template and sends to chat.
		this.genericItemTemplate(
			item.img, item.name, item.system.description, variable
		).then(
			html => this.sendToChat(CONST.CHAT_MESSAGE_TYPES.OTHER, speaker, html)
		);
	}

	async performContactRoll(item, speaker) {
		// Create variable div and populate it with localisation to use in the HTML.
		let variablePrompt = game.i18n.format("dishonored.roll.contact.relation");
		let variable = `<div class='dice-formula'> ${variablePrompt.replace("|#|", item.system.relationship)}</div>`;
		// Send the div to populate a HTML template and sends to chat.
		this.genericItemTemplate(
			item.img, item.name, item.system.description, variable
		).then(
			html => this.sendToChat(CONST.CHAT_MESSAGE_TYPES.OTHER, speaker, html)
		);
	}

	async performPowerRoll(item, speaker) {
		let variablePrompt;
		// Create variable div and populate it with localisation to use in the HTML.
		if (item.system.manacost > 0) {
			let localisedContent = game.i18n.format("dishonored.roll.power.mana");
			variablePrompt = `<div class='dice-formula'> ${localisedContent.replace("|#|", item.system.manacost)}</div>`;
		}
		else {
			variablePrompt = "";
		}
		let runeValue = game.i18n.format("dishonored.roll.power.rune");
		// Create dynamic tags div and populate it with localisation to use in the HTML.
		let tags = `<div class = 'tag'>${runeValue.replace("|#|", item.system.runecost)}</div>`;
		// Send the div to populate a HTML template and sends to chat.
		this.genericItemTemplate(
			item.img, item.name, item.system.description, variablePrompt, tags
		).then(
			html => this.sendToChat(CONST.CHAT_MESSAGE_TYPES.OTHER, speaker, html)
		);
	}

	async genericItemTemplate(img, name, description, variable, tags) {
		// Checks if the following are empty/undefined. If so sets to blank.
		let descField = description ? description : "";
		let tagField = tags ? tags : "";
		let varField = variable ? variable : "";
		// Builds a generic HTML template that is used for all items.
		let html = `
            <div class='dishonored roll generic'>
                <div class='dice-roll'>
                    <div class="dice-result">
                        <div class='dice-formula title'>
                            <img class='img' src=${img}></img>
                            <h1>${name}</h1>
                        </div>
                        ${varField}
                        <div class="dice-tooltip">${descField}</div>
                        <div class='tags'>
                            ${tagField}
                        </div>
                    <div>
                </div>
            </div>
        `;
		// Returns it for the sendToChat to utilise.
		return html;
	}

	async sendToChat(type, speaker, content, roll, flavour) {
		// Send's Chat Message to foundry, if items are missing they will appear
		// as false or undefined and this not be rendered.
		const chatData = {
			content: content,
			speaker: ChatMessage.getSpeaker({ scene: null, actor: speaker }),
			type: type,
			user: game.user.id,
		};

		// Only play the dice sound if there are actually dice being rolled
		if (type === CONST.CHAT_MESSAGE_TYPES.ROLL) {
			chatData.flavor = flavour;
			chatData.roll = roll;
			chatData.rollMode = game.settings.get("core", "rollMode");
			chatData.sound = "sounds/dice.wav";
		}

		ChatMessage.create(chatData).then(msg => {
			return msg;
		});
	}
}

