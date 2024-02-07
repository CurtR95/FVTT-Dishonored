import { DishonoredBaseItemSheet } from "./DishonoredBaseItemSheet";

export class DishonoredItemSheet extends DishonoredBaseItemSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			height: 480,
		});
	}

}
