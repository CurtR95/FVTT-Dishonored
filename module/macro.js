import {
    DishonoredRoll
} from './roll.js'

export function skillTest(actor, skillName, styleName, focusRating, numberOfDice) {
    let fail = false;  
    if (actor === undefined) {
        ui.notifications.warn(game.i18n.localize('dishonored.notifications.macroActor'));
        fail = true;
    }
    if (skillName === undefined) {
        ui.notifications.warn(game.i18n.localize('dishonored.notifications.macroSkill'));
        fail = true;
    }
    if (styleName === undefined) {
        ui.notifications.warn(game.i18n.localize('dishonored.notifications.macroStyle'));
        fail = true;
    }
    if (focusRating < 1) {
        ui.notifications.warn(game.i18n.localize('dishonored.notifications.macroFocus'));
        fail = true;
    }
    if (numberOfDice > 5) {
        ui.notifications.warn(game.i18n.localize('dishonored.notifications.macroDiceGreater'));
        fail = true;
    }
    else if (numberOfDice < 1) {
        ui.notifications.warn(game.i18n.localize('dishonored.notifications.macroDiceLess'));
        fail = true;
    }
    if (fail === true) {
        return false;
    }
    if (numberOfDice === undefined) {
        numberOfDice = 2;
    }
    if (focusRating === undefined) {
        focusRating = 1;
    }
    let skillValue = parseInt(actor.data.data.skills[skillName].value);
    let styleValue = parseInt(actor.data.data.styles[styleName].value);
    let dishonoredRoll = new DishonoredRoll();
    dishonoredRoll.performSkillTest(numberOfDice, skillValue+styleValue, focusRating, skillName, styleName, actor);
}
  