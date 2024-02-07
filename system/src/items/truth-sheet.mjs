import { DishonoredBaseItemSheet } from "./DishonoredBaseItemSheet";

export class DishonoredTruthSheet extends DishonoredBaseItemSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			height: 100,
		});
	}

}
