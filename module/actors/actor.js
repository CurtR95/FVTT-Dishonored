/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class DishonoredActor extends Actor {
	prepareData() {
		super.prepareData();

		const actorData = this.data;
		const data = actorData.data;
		const flags = actorData.flags;

		if (actorData.type === 'character') this._prepareCharacterData(actorData);
	}

	_prepareCharacterData(actorData) {
		const data = actorData.data;
		// console.log(data);
	}
}