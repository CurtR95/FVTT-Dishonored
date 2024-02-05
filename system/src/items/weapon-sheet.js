import { DishonoredBaseItemSheet } from "./DishonoredBaseItemSheet";

export class DishonoredWeaponSheet extends DishonoredBaseItemSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			width: 565,
			height: 400,
		});
	}

}
