import { DishonoredActor } from "./actors/actor.js"

export class DishonoredRoll {
	
	async perform()
    {
        const template = 'systems/FVTT-Dishonored/templates/chat/roll.html';
        const html = await renderTemplate(template, this);
        let flavor;
        if( this.actor){
            if (this.skill) flavor = game.i18n.format("CoC7.CheckResult", {name : this.skill.name, value : this.skill.data.data.value, difficulty : this.difficultyString});
            if (this.item) flavor = game.i18n.format("CoC7.ItemCheckResult", {item : this.item.name, skill : this.skill.name, value : this.skill.data.data.value, difficulty : this.difficultyString});
            if (this.characteristic) flavor = game.i18n.format("CoC7.CheckResult", {name : game.i18n.format(this.actor.data.data.characteristics[this.characteristic].label), value : this.actor.data.data.characteristics[this.characteristic].value, difficulty : this.difficultyString});
            if (this.attribute) flavor = game.i18n.format("CoC7.CheckResult", {name : game.i18n.format(this.actor.data.data.attribs[this.attribute].label), value : this.actor.data.data.attribs[this.attribute].value, difficulty : this.difficultyString});
        }
        else {
            if( this.rawValue) flavor = game.i18n.format("CoC7.CheckRawValue", {rawvalue : this.rawValue, difficulty : this.difficultyString});
        }

        if( pushing) {
            flavor = game.i18n.format("CoC7.Pushing") + flavor;
        }

        let speaker;
        if( this.actor){
            speaker = ChatMessage.getSpeaker({actor: this.actor});
            speaker.alias = this.actor.alias;
        }
        else speaker = ChatMessage.getSpeaker();

        ChatMessage.create({
			user: game.user._id,
            speaker: speaker,
            flavor: flavor,
			content: html
        }).then( msg => {return msg});

    }
}